<template>
    <div class="row">
        <div class="col-lg-12">
            <canvas width="100%" height="400px" id="mychart"></canvas>
        </div>
    </div>
</template>

<script>
import {Chart, PieController} from "chart.js"
export default {
    data () {
        return {
            ctx: document.getElementById("mychart"),
            config: {
                type: "pie",
            },
        }
    },
    props: ["pData"],
    watch: {
        data: {
            pData(val) {
                console.log(val)
            }
        }
    }
}
</script>

<style scoped>

</style>