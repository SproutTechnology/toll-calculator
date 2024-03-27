require('dotenv').config();

const axios = require('axios');
const crypto = require('crypto');

class VehicleSimulator {

    app = false;
    running = true;
    timeStamp = new Date();
    minSeconds = 1;
    maxSeconds = 20;
    vehicleTypes = ['Car', 'Truck', 'Bus', 'Taxi', 'Diplomat', 'Military', 'Foreign', 'Motorcycle', 'Tractor'];
        
    constructor() {
        this.runSimulation();
    }

    runSimulation() {
        const interval = setInterval( () => {
            // Randomize, ~50% chance, ish?
            if( ( Math.random() * 10) > 5 ) {
                // Do nothing, wait until next loop
                return;
            }

            const type = this.randomItem( this.vehicleTypes );
            const regnr = this.randomRegNr();

            console.log( 'Post: ' + type + ', ' + regnr );

            axios.post('http://localhost/vehicleToll', { type, regnr })
                .then(response => console.log(`POST success: ${response.data}`))
                .catch(error => console.error(`POST error: ${error}`));

        }, ( this.minSeconds * 1000 ));
    }

    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomRegNr() {
        
        let regNr = '';

        // Three random letters. ASCII codes for A-Z are between 65 and 90.
        for( let i = 0; i < 3; i++ ) {
            regNr += String.fromCharCode(65 + ( Math.floor( Math.random() * 26 ) ) );
        }

        regNr += '';

        // Three random numbers
        for( let i = 0; i < 3; i++ ) {
            regNr += Math.floor( Math.random() * 10 );
        }

        return regNr;
    }

}

module.exports = new VehicleSimulator();