const e = require("express");

class Vehicle {

    regNr = false;
    type = false;
    tollEvents = [];
    
    /**
     * Create a new Vehicle
     * @param {String} type 
     * @param {Integer} regNr 
     */
    constructor( type, regNr, tollEvents = [] ) {
        this.type = type;
        this.regNr = regNr;
        this.tollEvents = tollEvents;
    }

    /**
     * Get the last toll event in the array
     * @returns Array
     */
    getLastTollEvent() {
        
        if( this.tollEvents.length > 0 ) {
            
            let sortedEventsByDate = this.tollEvents.sort( ( a, b ) => {
                if( a.time > b.time ) {
                    return -1;
                }
                else if( a.time < b.time ) {
                    return 1;
                }
                else {
                    return 0;
                }
            });

            return sortedEventsByDate[ 0 ];
        }
        else {
            return false;
        }
    }

    /**
     * Add a new Toll Event
     * @param {DateTime} time 
     * @param {Integer} fee 
     */
    addTollEvent( time, fee, override = false ) {

        console.log( 'addTollEvent()' );
        console.log( { time, fee, override } );

        let tollEvent = {
            time: time,
            fee: fee
        }

        if( override ) {
            tollEvent.override = true;
        }
        
        this.tollEvents.push( tollEvent );

        return tollEvent;

    }

}

module.exports = Vehicle;