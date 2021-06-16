<template>
    <div>
        <network ref="network" id="network"
            :nodes="nodes"
            :edges="edges"
            :options="options"></network>
            <!--<button v-on:click="retrieveDot('S')">GetDots</button> -->
            <button v-on:click="readDotFile('./dot.txt')">GetDots</button>
    </div>
</template>

<script>
import {Network} from "vue-vis-network"
import {parseDOTNetwork} from "vis-network/standalone"
import axios from "axios"
import "vue-vis-network/node_modules/vis-network/dist/vis-network.css"


export default {
    components: {
        network: Network
    },
    data () { 
        return {
            dotArray: [],
            nodes : [],
            edges: [],
            options: {
                layout: {
                    hierarchical: {
                        enabled: true,
                    },
                },
                physics: {
                    enabled: false,
                },
                layout: {
                    improvedLayout: false,
                    hierarchical: {
                        direction: "UD",
                        nodeSpacing: 400,
                        enabled: true,
                        sortMethod: "directed",
                        shakeTowards: "leaves",
                    }
                },
                clickToUse: true,
                height: "100%",
                width: "100%",
                nodes: {
                    borderWidth: 1,
                    color: "red",
                },
                edges: {
                    color: "lightgray"
                }
            },
        }
    },
    watch: {
        dotArray(val) {
            console.log(val)
            var parsedDot = new parseDOTNetwork(val.join("\n"))
            console.log(parsedDot)
            var data = {
                nodes: parsedDot.nodes,
                edges: parsedDot.edges
            }
            this.edges = data.edges;
            this.nodes = data.nodes;
            console.log(data)
        },        
    }, 
    methods: {
        retrieveDot (bait) {
            var instance = axios.create({baseURL: "http://127.0.0.1:8048"})
            instance.get(`/dot?bait=${bait}`)
                .then(res => {
                    this.dotStr = res.data;
                })
                .catch(err => console.log("error occured: ", err))
        },
        readDotFile(file) {
            axios.get(`./dot.txt?timestamp=${new Date().getTime()}`)
                .then(res => {
                    //console.log(res.data)
                    var dotArray = res.data.split("\n")
                    this.dotArray = dotArray;
                })
                .catch(err => {console.log("error occured:", err)})
        }
    }
}
</script>

<style scoped>
#network {
    width: 900px;
    height: 500px;
    border: 1px solid lightgray;
    margin-left: auto;
    margin-right: auto;
}
</style>