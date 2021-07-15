<template>
    <div>
        <div class="well well-sm">
            <h3 class="text-center">Interactive map of biological processes terms for <strong>{{bait}}</strong> protein </h3>
            <div class="row">
                <div class="col-lg-12">
                    <div id="network"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="col-lg-1 text-right">-log10 of thresholds: </div> 
                    <div class="col-lg-11">
                        <span v-for="th in thresholds" :key="th.threshold" class="threshold" :style="`background-color: ${th.hex}`">
                            {{-Math.log10(th.threshold)}}
                        </span>
                    </div>
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
    props: ["graph", "bait", "goTerms"],
    data () { 
        return {
            thresholds: [],
            goTermsIDs: {},
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
            var node = this.visData.nodes.find(n => n.id === goID)
            if (node) {
                this.network.moveTo({
                    position: {x:node.x, y:node.y},
                    scale: 0.3,
                    offset: {x:0, y:0},
                    animation: {
                        duration: 300,
                        easingFunction: "linear"
                    }
                })
                this.$root.$emit("highlightTerm", goID)
            }
        })
    },
    watch: {
        graph(val) {
            var parsedDot = new parseDOTNetwork(val.join(" "))
            console.log(parsedDot)
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
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        bindEvents() {
            this.network.on("doubleClick", obj => {
                var termGOid = obj.nodes[0]
                this.$root.$emit("highlightTerm", termGOid)
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
            // for highlighting go terms in the graph present in the list of super enriched go terms
            var goTermsIDs = this.goTerms.map(t => t.goID)

            // regex match pattern to extract the score out of node's labels
            var regexLabelScore = /\\[0-9.e<\s+-]*\\/g
            var regexFocusOnNumber = /[\\<]/g
            var regexReplace = /\\[0-9.e<\s+-]*\\|[0-9]*\s\/\s[0-9]*/g
            // max and min score as the range for the color gradient of terms
            var scores = this.visData.nodes.map(n => {
                var scoreValue = n.label.match(regexLabelScore)
                if (scoreValue != null) {
                    return parseFloat(scoreValue[0].replace(regexFocusOnNumber, ""))
                } else {
                    return 1
                }
            }).sort((a,b) => a - b)
            var maxScore = scores[scores.length-1]
            var minScore = scores[0]
            var numOfThrsh = Math.ceil(-Math.log10(minScore) - (-Math.log10(maxScore)))
            console.log("maxScore: ", maxScore, "minScore: ", minScore)
            // make the gradient and the thresholds
            this.thresholds = []
            for(var i=0;i<=numOfThrsh;i++) {
                var g = 255/numOfThrsh*i
                var obj = {
                    threshold: parseFloat(`1e-${numOfThrsh-(i)}`),
                    hex: this.rgbToHex(255,g,0)
                }
                this.thresholds.push(obj)    
            }

            this.visData.nodes.forEach((node,i,a) => {
                if (goTermsIDs.includes(node.id)) {
                    node.shadow = {
                        enabled: true
                    }
                }
                /* DEPRECATED BEHAVIOUR
                if (node.color.background == "black") {
                    node.color.background = "#d9f551"
                    node.shape = "box"
                } else {
                    node.color.background = "#f56951"
                }*/

                // create orange-red gradiant for most significative terms and other terms will be in yellow
                var scoreMatch = node.label.match(regexLabelScore)
                var score = (scoreMatch != null) ?parseFloat(scoreMatch[0].replace(regexFocusOnNumber, "")):1
                // retrieve the hex value from the thresholds variable 
                node.color.background = this.thresholds.filter(th => th.threshold <= score).sort((a,b) => b.threshold - a.threshold)[0].hex

                node.label = node.label.replace(/\\/, "\n") // make a newline between the GO:ID and the go term name
                node.label = node.label.replace(regexReplace, "")

                var positions = node.pos.split(",")
                node.y = -positions[1]*1.5

                

                node.shape = "box"

                //node.height = 1
                if (a.length>50) {
                    node.font.size = 35
                    node.x = positions[0]*5
                } else {
                    node.font.size = 20
                    node.x = positions[0]*3
                }

                node.widthConstraint = {
                    minimum: 100,
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
.threshold {
    float: left;
    text-align: center;
    width: 70px;
    margin-left: 10px;
}
#network {
    height: 800px;
    border: 1px solid lightgray;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
}
</style>