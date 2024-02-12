require('dotenv').config();

const express = require('express');
const compression = require( 'compression');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// "Realtime" communication with socketio
const http = require('http').createServer();
const io = require("socket.io")(http, {
    cors: {
        origin:"*",
        methods: ["GET", "POST"],
        credentials: false
    }
});

const TollCalculator = require('./TollCalculator.js');
const Vehicle = require('./Vehicle.js' );

class TollServer {

    app = false;
    
    // We store registered vehicles in an object, to easily do RegNr lookups.
    // Since regNr's are unique, they'll be used as keys. So "registeredVehicles['abc-123']" is a quick way to fetch a vehicle instance.
    //registeredVehicles = {};

    // Mock
    registeredVehicles = {
        /*'abc-123': {
            type: 'Car',
            regNr: 'abc-123',
            tollEvents: [
                { time: new Date('2024-02-10 13:25:00'), fee: 8 },
                { time: new Date('2024-02-10 14:30:00'), fee: 13, override: true },
                { time: new Date('2024-02-10 15:30:00'), fee: 18 },
                { time: new Date('2024-02-10 17:30:00'), fee: 8 },
                { time: new Date('2024-02-10 18:30:00'), fee: 0 },
                { time: new Date('2024-02-10 13:25:00'), fee: 8 },
                { time: new Date('2024-02-10 14:30:00'), fee: 13, override: true },
                { time: new Date('2024-02-10 15:30:00'), fee: 18 },
                { time: new Date('2024-02-10 17:30:00'), fee: 8 },
                { time: new Date('2024-02-10 18:30:00'), fee: 0 },
                { time: new Date('2024-02-10 13:25:00'), fee: 8 },
                { time: new Date('2024-02-10 14:30:00'), fee: 13, override: true },
                { time: new Date('2024-02-10 15:30:00'), fee: 18 },
                { time: new Date('2024-02-10 17:30:00'), fee: 8 },
                { time: new Date('2024-02-10 18:30:00'), fee: 0 },
                { time: new Date('2024-02-10 13:25:00'), fee: 8 },
                { time: new Date('2024-02-10 14:30:00'), fee: 13, override: true },
                { time: new Date('2024-02-10 15:30:00'), fee: 18 },
                { time: new Date('2024-02-10 17:30:00'), fee: 8 },
                { time: new Date('2024-02-10 18:30:00'), fee: 0 }
            ]
        },
        'bfg-321': {
            type: 'Car',
            regNr: 'bfg-321',
            tollEvents: [
                { time: new Date('2024-02-10 13:25:00'), fee: 8 },
                { time: new Date('2024-02-10 14:30:00'), fee: 13 }
            ]
        }*/
    }
    
    constructor() {

        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        
        this.app.use(express.static(path.join(__dirname, '../frontend/dist')));

        this.app.use(compression());

        this.app.use(cors());

        this.setupRoutes();

        this.setupWebsockets();

        this.startServer();
    }

    setupWebsockets() {
        io.on('connectiom', ( socket ) => {
            console.log( 'Frontend Connected' );

            socket.on( 'disconnect', () => {
                console.log( 'Frontend Disconnected' );
            });
            
        });

        http.listen( 3000, () => {
            console.log( 'Http/Socket server listening on port 3000' );
        });
    }

    /**
     * 
     * @param {String} regNr 
     * @returns Object
     */
    getVehicleByRegNr( regNr ) {
        return this.registeredVehicles[ regNr ] ?? false;
    }

    
    /**
     * Setup all the express http routes
     */
    setupRoutes() {

        this.app.get('/', (req, res) => {
            res.sendFile( path.join(__dirname, '../frontend/dist/index.html'));
        });

        // Fetch all toll events
        this.app.get('/tollEvents', ( req, res ) => {

            console.log( 'Get all Toll Events' );

            let tollEvents = [];

            for( const [key, value] of Object.entries( this.registeredVehicles ) ) {

                const vehicle = value;               
                const numVehicleEvents = vehicle.tollEvents.length;

                console.log( 'Vehicle ' + vehicle.regNr + ' has had ' + numVehicleEvents + ' Toll Events' );

                for( let j = 0; j < numVehicleEvents; j++ ) {

                    const tollEvent = vehicle.tollEvents[ j ];

                    tollEvents.push({
                        regNr: vehicle.regNr,
                        time: tollEvent.time,
                        fee: tollEvent.fee,
                        override: tollEvent.override ?? false
                    });
                }
            }

            res.json({
                events: tollEvents
            })
        });

        // Get info for a vehicle
        this.app.get( '/vehicle/:regnr', ( req,res ) => {
            console.log( '/vehicle' );
            console.log( req.params.regnr );
            if( typeof req.params.regnr !== 'undefined' ) {

                const regNr = req.params.regnr;

                const vehicle = this.getVehicleByRegNr( regNr );

                const totalTollFee = TollCalculator.getTotalDailyVehicleFee( vehicle );

                res.json({
                    ok: true,
                    vehicle: vehicle,
                    totalFee: totalTollFee
                })

            }
            else {
                res.json({
                    ok: false,
                    error: 'Missing Registration Number'
                });
            }
        });

        // Route for creating a toll fee for a Vehicle
        this.app.post('/vehicleToll', ( req,res ) => {
            
            console.log( 'Vehicle Toll Request' );
            
            let vehicleType = req.body.type ?? 'Car';
            let vehicleRegnr = req.body.regnr ?? false;
            
            // TODO: Check for correct datesstring format
            // TODO: Convert all dates to UTC?
            let time = ( typeof req.body.time !== 'undefined' && req.body.time !== null ) ? new Date( req.body.time) : new Date(); 

            console.log( { time } );

            console.log( 'Type: ' + vehicleType + ', RegNr: ' + vehicleRegnr );

            if( vehicleRegnr === false ) {
                res.json({ ok: false, error: 'Missing Vehicle RegNr' });
            }
            else {
                
                
                let vehicle = false;
                let newTollEvent = false;
                
                // Fetch exisitng vehicle instance for regnr if it exists
                if( typeof this.registeredVehicles[ vehicleRegnr ] !== 'undefined' ) {
                    let existingVehicle = this.registeredVehicles[ vehicleRegnr ];
                    vehicle = new Vehicle( existingVehicle.type, existingVehicle.regNr, existingVehicle.tollEvents );
                }
                // No existing vehicle found, create a new vehicle to store
                else {
                    vehicle = new Vehicle( vehicleType, vehicleRegnr );
                    this.registeredVehicles[ vehicleRegnr ] = vehicle;
                }

                // While some vehicles are excepted from toll fees, it might still be a good idea to log when they drive through a Toll for statistics purposes.
                if( TollCalculator.isVehicleTollFree( vehicle ) ) {
                    newTollEvent = vehicle.addTollEvent(time, 0 );
                }
                else {
                    const tollFeeByTime = TollCalculator.getDateTimeTollFee( time );
                    const lastTollEvent = vehicle.getLastTollEvent();

                    if( lastTollEvent === false ) {
                        newTollEvent = vehicle.addTollEvent(time, tollFeeByTime );
                    }
                    else {
                        const diffSinceLast = Math.abs(time - lastTollEvent.time );

                        // Convert milliseconds to seconds and divide by 60 to get number of minutes
                        const minutesSinceLast = Math.floor(( diffSinceLast / 1000 ) / 60 );

                        console.log( { lastTollEvent });

                        console.log( 'Minutes since last: ' + minutesSinceLast );

                        // If the event happened within the same hour, override the lowest fee.
                        // The override flag is used when calculating the total daily fee.
                        if( minutesSinceLast <= 60 ) {

                            if( tollFeeByTime >= lastTollEvent ) {
                                lastTollEvent.override = true;
                                newTollEvent = vehicle.addTollEvent(time, tollFeeByTime );
                            }
                            else {
                                newTollEvent = vehicle.addTollEvent(time, tollFeeByTime, true );
                            }
                        }
                        else {
                            newTollEvent = vehicle.addTollEvent( time, tollFeeByTime );
                        }
                    }
                }

                io.emit("tollEvent", { vehicle: vehicle, event: newTollEvent } );

                res.json({
                    ok: true,
                    tollEvent: newTollEvent
                })
            }
        });

        this.app.get( '*', (req, res) => {
            res.status(404).json({'code': 404, 'error': 'Could not find..'});
        })
    }

    startServer() {
        this.app.listen( process.env.HTTP_PORT );
        console.log( 'Toll Server is listening on port ' + process.env.HTTP_PORT );
    }

}

module.exports = new TollServer();