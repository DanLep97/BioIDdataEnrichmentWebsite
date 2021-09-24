<template>
	<div class="wrapper">
		<interactor-box/>	
	</div>
</template>
<script>
import InteractorBox from "./InteractorBox.vue"
export default {
	components: {
		InteractorBox,
	}
}
</script>
<style scoped>
.wrapper {
	padding: 1em;
	/* background-color: black; */
	border-style: solid;
	border-color: red;
	border-width: 1px;
}
</style>