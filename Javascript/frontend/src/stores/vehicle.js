import { defineStore } from 'pinia';

export const useVehicleStore = defineStore('vehicles', {
    state: () => ({
        selectedVehicleRegNr: false,
    }),
    getters: {
        selectedVehicleRegnr: (state) => {
            return state.selectedVehicleRegNr
        }
    },
    actions: {
        setSelectedVehicleRegNr( regNr ) {
            console.log( 'STORE() - Set selected vehicle to ' + regNr );
            this.selectedVehicleRegNr = regNr;
        }
    },

})