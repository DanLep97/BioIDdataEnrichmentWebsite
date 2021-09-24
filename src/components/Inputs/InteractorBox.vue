<template>
   <div>
       <div class="box-container">
           <span class="box-title">
               Bait: <input type="text" v-model="baitName">
           </span>
           <div class="box-textarea">
               <textarea name="" id="" v-model="inputs" cols="60" rows="10"></textarea>
           </div>
       </div>
   </div> 
</template>
<script>
export default {
   data() {
       return {
           inputs: "",
           baitName: "test",
       }
   } 
}
</script>
<style scoped>
.box-textarea {
    margin-top: 0.5em;
}
</style>