require('dotenv').config();

const { isPublicHoliday } = require('swedish-holidays');

/**
 * Toll Calculator Class
 */
class TollCalculator {

    tollFreeVehicleTypes = process.env.TollFreeVehicleTypes ?? [ 'Motorbike', 'Tractor', 'Emergency', 'Diplomat', 'Foreign', 'Military' ];
    maxPerDay = process.env.MAX_DAILY_TOLL ?? 60; // Fallback to 60 SEK in case of missing env variable

    /**
     * Get the total daily fee for a vehicle
     * @param {string} regNr - The registration number of the vehicle.
     * @param {date} day - The date to summarize toll events for.
     */
    getTotalDailyVehicleFee( vehicle, day = new Date() ) {

        const dateString = day.toISOString().split('T')[0];
        
        const dailyTollEvents = vehicle.tollEvents.filter( ( tollEvent ) => {
            const eventDateString = tollEvent.time.toISOString().split('T')[0];
            if( eventDateString === dateString ) {
                return true;
            }
            else {
                return false;
            }
        });

        let totalFee = 0;

        for( let i = 0; i < dailyTollEvents.length; i++ ) {
            if( typeof dailyTollEvents[ i ].override !== 'undefined' && dailyTollEvents[ i ].override === true ) {
                // Fee overrides are skipped, since there should be a matched fee with higher value for the same hour
                continue;
            }
            
            totalFee += dailyTollEvents[ i ].fee;

            // If the max is reached, stop counting and set it to max daily fee
            if( totalFee >= this.maxPerDay ) {
                totalFee = this.maxPerDay;
                break;
            }
        }

        return totalFee;

    }

    /**
     * Check if a vehicle is toll free.
     * @param {Object} vehicle - A Vehicle object instance
     * @returns Boolean
     */
    isVehicleTollFree( vehicle ) {
        if( typeof vehicle === 'undefined' || typeof vehicle.type === 'undefined' ) {
            console.log( 'Undefined Vehicle or Vehicle Type' );
            return false;
        }

        return ( this.tollFreeVehicleTypes.indexOf( vehicle.type ) > -1 );
    }
    
    /**
     * Get the toll fee for a time of day
     * @param {Date} time 
     * @returns Integer
     */
    getDateTimeTollFee( time = new Date() ) {

        console.log( 'getDateTimetollFee()' );
        
        // TODO: check for correct date format

        const hour = time.getHours();
        const minute = time.getMinutes();
        const dayOfWeek = time.getDay();
        const month = time.getMonth();

        console.log( { hour, minute, dayOfWeek, month });

        // Weekends are free
        if( dayOfWeek === 6 || dayOfWeek === 7 ) {
            console.log( 'No fee - weekend! ');
            return 0;
        }

        // Public holidays as well as the entire month of July (industrisemester) is free.
        // There are three routes here - hardcode new dates each year, use a dedicated library, or write all the logic yourself.
        // But do you (or I?) really want to spend the time calculating moon phases in order to figure out when Easter is?
        // So - I've decided to use the 'swedish-holidays' NPM package, as it provides an "isPublicHoliday" method that seem to cover all of the cases, except summer-vacation in July.
        if( isPublicHoliday( time ) ) {
            console.log( 'Its a public holiday! no fee.');
            return 0;
        }

        // July = free (Industrisemester)
        if( month === 7 ) {
            console.log( 'Industrisemester, no fee!' );
            return 0;
        }


        // Between 06:00 and 06:29 = 8 SEK
        if (hour == 6 && minute >= 0 && minute <= 29) {
            return 8;
        }
        // Between 06:30 and 06:59 = 13 SEK
        else if (hour == 6 && minute >= 30 && minute <= 59) {
            return 13;
        }
        // Between 07:00 and 07:59 = 18 SEK
        else if (hour == 7 && minute >= 0 && minute <= 59) {
            return 18;
        }
        // Between 08:00 and 08:29 = 13 SEK
        else if (hour == 8 && minute >= 0 && minute <= 29) {
            return 13;
        }
        // Between 08:30 and 14:59 = 8 SEK
        else if ((hour >  8 || (hour ==  8 && minute >=  30)) && (hour <  15 || (hour ==  14 && minute <=  59))) {
            return 8;
        }
        // Between 15:00 and 15:29 = 13 SEK
        else if (hour == 15 && minute >= 0 && minute <= 29) {
            return 13;
        }
        // Between 15:30 and 16:59 = 18 SEK
        else if ((hour == 15 && minute >= 30) || (hour == 16 && minute <= 59)) {
            return 18;
        }
        // Between 17:00 and 17:59 = 13 SEK
        else if (hour == 17 && minute >= 0 && minute <= 59) {
            return 13;
        }
        // Between 18:00 and 18:29 = 8 SEK
        else if (hour == 18 && minute >= 0 && minute <= 29) {
            return 8;
        }
        // Between 18:00 and 05:59 - 0 SEK
        else {
            console.log( 'Between 18:00 and 05:59 - no fee' );
            return 0;
        }

        return false;

    }
}

module.exports = new TollCalculator();