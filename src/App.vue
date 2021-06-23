<template>
  <div class="container-fluid">
  <!--  <vis-network/>-->
    <div class="row">
      <div class="col-lg-12">
        <results/>
      </div>
    </div>

  </div>
</template>

<script>
import Results from "./components/Results/Index.vue"

export default {
  name: 'App',
  components: {
    Results,
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
