<template>
    <div class="vehicleSearch">
        <div class="search">
            <label>Search vehicle:
            <input type="text" v-model="searchedRegNr"  @keyup.enter="handleSearchClick" />
            <button @click="handleSearchClick" >Search</button>
            </label>
        </div>
        <div class="vehicle" v-if="vehicleResponse">
            <div class="regNr">
                <h1>{{vehicleResponse.vehicle.regNr}}</h1>
            </div>
            <div class="stats">
                <span class="type">Type: <strong>{{vehicleResponse.vehicle.type}}</strong></span>
                <span class="totalFee">Total fee today: <strong>{{vehicleResponse.totalFee}} SEK</strong></span>
                <span class="numPasses">Total passes today: <strong>{{vehicleResponse.vehicle.tollEvents.length}}</strong></span>
            </div>
        </div>
        <div class="vehicle empty" v-else>
            <h1>No Selected Vehicle</h1>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useVehicleStore } from '../stores/vehicle';
import { format } from "date-fns";

export default {
    data() {
        return {
            searchedRegNr: '',
            vehicleResponse: false
        }
    },
    beforeMount() {    
    },
    computed: {
        selectedVehicleRegNr() {
            const vehicleStore = useVehicleStore();
            return vehicleStore.selectedVehicleRegnr;
        }
    },
    watch: {
        selectedVehicleRegNr( newVal, oldVal ) {
            if( newVal !== oldVal && typeof newVal !== 'undefined' && newVal !== false ) {
                console.log( 'The selected vehicle changed!' );
                this.handleSearchClick( newVal );
            }
        }
    },
    mounted() {
        console.log( 'VehicleSearcn mounted()' );
    },
    methods: {
        async handleSearchClick( regNr ) {
            const response = await fetch( 'http://localhost/vehicle/' + ( regNr ?? this.searchedRegNr ) );
            const vehicle = await response.json();
            this.vehicleResponse = vehicle;
            this.searchedRegNr = "";
        },
        formatDate( dateString ) {
            let date = new Date( dateString );
            return format( date, "dd/MM H:mm" );
        }
    }
}
</script>

<style>
.vehicle {
    min-height: 30dvh;
}
.vehicle .stats {
    display: flex;
    align-content: center;
    justify-content: space-between;
    margin: 20px 0 0 0;
}

.vehicle .stats span {
    display: block;
    padding: 10px;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
}

.vehicle {
    padding: 25px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-top: 25px;
}

.vehicle .regNr {
    font-size: 32px;
    padding: 10px 0;
}

.vehicle .regNr:before {
    font-size: 20px;
}

/** Phone & tablet portrait */
@media screen and (max-width: 900px) {
    .vehicle .stats {
        flex-direction: column;
        gap: 7px;
    }
}
</style>
