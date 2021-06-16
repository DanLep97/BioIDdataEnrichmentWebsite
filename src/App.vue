<template>
  <div id="app">
  <!--  <vis-network/>-->
    <div class="row">
      <div class="col-lg-3"></div>
      <div class="col-lg-6"><fingerprint/></div>
      <div class="col-lg-3"></div>
    </div>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import VisNetwork from './components/VisNetwork.vue'
import Fingerprint from "./components/Fingerprint.vue"

export default {
  name: 'App',
  components: {
    HelloWorld,
    VisNetwork,
    Fingerprint,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
