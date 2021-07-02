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
                    physics: false,
                },
                edges: {
                    color: "red",
                    width: 5,
                    smooth: {
                        "type": "cubicBezier",
                        "forceDirection": "horizontal",
                        "roundness": 0.5
                    }
                }
            },
        }
    },
    created () {
        this.$root.$on("zoomOnMap", goID => {
            console.log(goID)
            var node = this.visData.nodes.find(n => n.id === goID)
            this.network.moveTo({
                position: {x:node.x, y:node.y},
                scale: 0.4,
                offset: {x:0, y:0},
                animation: { // -------------------> can be a boolean too!
                    duration: 600,
                    easingFunction: "linear"
                }
            })
            this.network.hoverNode(goID)
        })
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
            this.visData.nodes.pop();
            this.updateNodes();
            this.updateEdges()

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
            this.network.on("stabilized", iterations => {
                this.network.fit()
            })
        },
        average (a) {
            var total = 0;
            for(var i = 0; i < a.length; i++) {
                total += grades[i];
            }
            var avg = total / a.length;
            return avg
        },
        updateNodes() {
            this.visData.nodes.forEach(node => {

                var positions = node.pos.split(",")
                node.y = -positions[1]*1.5
                node.x = positions[0]*5

                //change the color to visible
                if (node.color.background == "black") {
                    node.color.background = "#d9f551"
                    node.shape = "box"
                } else {
                    node.color.background = "#f56951"
                }

                //node.label = node.label.replace(/GO:[0-9]*\\/, "")
                node.label = node.label.replace(/\\/, "\n")
                //node.label = node.label.replace(/((?:[^\s]*\s){2}[^\s]*)\s/, "\n")

                //node.height = 1
                node.font.size = 32
                node.widthConstraint = {
                    minimum: 200,
                    maximum: 400,
                }

            })
        },
        updateEdges() {

        },
    }
}
</script>

<style>
#network {
    height: 800px;
    border: 1px solid lightgray;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
}
</style>