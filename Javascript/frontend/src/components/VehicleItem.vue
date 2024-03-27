<template>
  <div :class="tollEvent.vehicle.type" class="vehicleItem">
    <div class="regNr" @click="() => showVehicle(tollEvent.vehicle.regNr)">
        {{tollEvent.vehicle.regNr}}
    </div>
    <div class="eventDetails">
        <span class="timeStamp">{{formatDate( tollEvent.event.time )}}</span>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { useVehicleStore } from '../stores/vehicle';

export default {
    props: [
        'tollEvent'
    ],
    data() {
        return {
            vehicleStore: false
        }
    },
    mounted() {
    },
    methods: {
        formatDate( dateString ) {
            let date = new Date( dateString );
            return format( date, "H:mm" );
        },
        showVehicle( regNr ) {
            console.log( 'Clicked on show vehicle', regNr );
            const vehicleStore = useVehicleStore();
            vehicleStore.setSelectedVehicleRegNr( regNr );
        }
    }
}
</script>

<style scoped>

.vehicleItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.vehicleItem + .vehicleItem {
    margin-top: 10px;
}

.vehicleItem .regNr {
    width: 50%;
    cursor: pointer;
}

.vehicleItem .regNr:hover {
    border-color: white;
    box-shadow: 0 0 15px 2px rgba(255,255,255,0.9);
}

.eventDetails {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
}
</style>