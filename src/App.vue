<template>
	<div class="wrapper">
		<div class="section">
    		<header-nav/>
    	</div>
		<!--<div class="section">
			<inputs/>
		</div> -->
    	<div class="section">
    	  	<about/>
    	</div>
    	<div class="section">
      		<results/>
    	</div>
	</div>
</template>

<script>
import Results from "./components/Results/Index.vue"
import About from "./components/About.vue"
import HeaderNav from "./components/Header.vue"
import Inputs from "./components/Inputs/Index.vue"

export default {
  name: 'App',
  components: {
    Results,
    About,
    HeaderNav,
    Inputs,
  }
}
</script>

<style>
.wrapper {
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
