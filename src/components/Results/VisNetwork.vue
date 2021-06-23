<template>
    <div class="row">
        <div class="well well-sm">
            <h3 class="text-center">Interactive map of biological processes terms for <strong>{{bait}}</strong> protein </h3>
            <div class="row">
                <div class="col-lg-12">
                    <div id="network"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3"></div>
                <div class="col-lg-3"></div>
                <div class="col-lg-6"><h4 class="text-right">Top 5 most significative terms (in red)</h4></div>
            </div>
        </div>
    </div> 
</template>

<script>
import {parseDOTNetwork} from "vis-network/standalone"
import "vue-vis-network/node_modules/vis-network/dist/vis-network.css"


export default {
    components: {

    },
    props: ["graph", "bait"],
    data () { 
        return {
            network: {},
            dotArray: [],
            visData: {
                nodes : [],
                edges: [],
            },
            options: {
                physics: {
                    enabled: false,
                },
                interaction: {
                    dragNodes: false,// do not allow dragging nodes
                    zoomView: true, // do not allow zooming
                    dragView: true  // do not allow dragging
                },
                clickToUse: true,
                nodes: {
                    borderWidth: 1,
                },
                edges: {
                    color: "red"
                }
            },
        }
    },
    watch: {
        graph(val) {
            var parsedDot = new parseDOTNetwork(val.join(" "))
            var data = {
                nodes: parsedDot.nodes,
                edges: parsedDot.edges
            }
            this.visData.edges = data.edges
            this.visData.nodes = data.nodes
            // update visData structure..
            this.updateNodes();

            // initiate network
            this.network = new vis.Network(document.getElementById("network"),this.visData, this.options)
            
            // those are usefull for triggering inter component data change
            this.bindEvents()
        },        
    }, 
    methods: {
        bindEvents() {
            this.network.on("doubleClick", obj => {
                var termGOid = obj.nodes[0]
                this.$root.$emit("highlightTerm", termGOid)
            })
        },
        updateNodes() {
            this.visData.nodes.forEach(node => {
                var positions = node.pos.split(",")
                node.x = positions[0]
                node.y = -positions[1]

                //change the color to visible
                if (node.color.background == "black") {
                    node.color.background = "#d9f551"
                } else {
                    node.color.background = "#f56951"
                }

                node.label = node.label.replace(/GO:[0-9]*\\/, "")

                node.height = 1
                node.font.size = 6

            })
        }
    }
}
</script>

<style scoped>
#network {
    height: 500px;
    border: 1px solid lightgray;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
}
</style>