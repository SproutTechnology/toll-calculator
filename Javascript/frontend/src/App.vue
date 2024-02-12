<template>
  <div class="main">
    <div class="intro">
      <header>
        <h1>Regional Traffic Toll</h1>
        <p>Welcome to the traffic toll admin interface. Here you can search for vehicles that has passed through the toll station by entering the registration number below, and view a realtime feed of the toll station.</p>
      </header>
      <VehicleSearch />
    </div>
    <div class="realtime">
      <h2>Realtime Feed</h2>
      <TransitionGroup name="vehicleList" tag="div">
        <VehicleItem v-for="tollEvent in realtimeTollEvents" :key="tollEvent" :tollEvent="tollEvent" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import VehicleSearch from './components/VehicleSearch.vue'
import VehicleItem from './components/VehicleItem.vue';

export default {
  components: {
    VehicleSearch,
    VehicleItem
  },
  data() {
    return {
      socket:  null,
      realtimeTollEvents: []
    }
  },
  mounted() {
    this.socket = io( 'http://localhost:3000' );
    this.socket.on('connect', () => {
      console.log( 'Connected to Socket server' );
    });

    this.socket.on( 'tollEvent', (data) => {
      this.realtimeTollEvents.unshift( data );

      // Only store last 10 vehicles in order to save on browser memory
      if( this.realtimeTollEvents.length > 15 ) {
        this.realtimeTollEvents.length = 15;
      }
    });
  },
  destroyed() {
    if( this.socket ) {
      this.socket.disconnect();
    }
  },
  methods: {
  },
}
</script>

<style>
.main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr auto;
  gap: 50px;
}

.main header {
  grid-column: 1;
}

.main .selectedVehicle {
  grid-column: 1;
  grid-row: 2;
}

.main  .realtime {
  grid-column: 2;
  grid-row: span 2;
}

.realtime {
  padding: 25px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.realtime h2 {
  margin: 0 0 0.6em 0;
}

.realtime p {
  margin: 0 0 2em 0;
}

.realtime .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.regNr {
    border: 2px solid #000;
    border-radius: 10px;
    background: #efefef;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 30px;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    line-height: 1;
    min-height: 40px;
    font-weight: bold;
}

.regNr:before {
    content: 'S';
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: 50%;
    background: blue;
    border-radius: 5px 0 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: #fff;
    padding: 0 0 4px 0;
}

.Foreign .regNr:before,
.Diplomat .regNr:before,
.Military .regNr:before {
  display: none;
}

.Taxi .regNr {
  background: #F5B102;
}

.Diplomat .regNr {
  background: #459AD2;
}

.Military .regNr {
  background: #121212;
  color: #F5B102;
}



.vehicleList-move,
.vehicleList-enter-active,
.vehicleList-leave-active {
  transition: all 0.5s ease;
}

.vehicleList-enter-from,
.vehicleList-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.vehicleList-leave-active {
  position: absolute;
}

/** Phone & tablet portrait */
@media screen and (max-width: 900px) {
  #app {
    height: 100dvh;
    overflow: hidden;
  }

  .main {
    display: block;
    height: 100dvh;
    overflow: hidden;;
  }

  .main header {
    height: 20dvh;
    overflow: hidden;
  }

  .main .vehicleSearch {
    height: 40dvh;
    overflow: hidden;
  }
  
  .realtime {
    height: 35dvh;
    overflow: hidden;
  }
}
</style>