<template>
    <div>
        <h3 class="text-center"><strong>Generate Data</strong></h3>
        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-10">
                <div class="row">
                    <div class="col-lg-3"></div>
                    <div class="col-lg-4">
                        <label for="lengthForBaits">Number of bait from the dataset to enrich:</label>
                        <input id="lengthForBaits" type="text" v-model="filters.lengthForBaits">
                        <label for="nodeLength">Number of significant nodes displayed on graph:</label>
                        <input id="nodeLength" type="text" v-model="filters.nodeLength">
                        <button v-on:click="fingerprint" id="fingerprintBtn">Fingerprint!</button>
                    </div>
                    <div class="col-lg-5"></div>
                </div>
            </div>
            <div class="col-lg-2"></div>
        </div>
        <hr>
        <h3 class="text-center"><strong> Display Data </strong></h3>
        <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-2">
                <label for="">Bait</label>
                <select id="bait" v-model="bait">
                    <option disable>Choose</option>
                    <option v-for="b in baits" :key="b">{{b}}</option>
                </select>
            </div>
            <div class="col-lg-2">
                    <label for="">Ontology</label>
                    <select id="ont" v-model="ontology">
                    <option disable>Choose</option>
                    <option v-for="ont in availableOnt" :key="ont">{{ont}}</option>
                </select>
            </div>
            <div class="col-lg-5"><button v-on:click="goFilter">GO!</button></div>
        </div>
        <div class="row">
            <div class="table-div">
                <div class="col-lg-4 table-cell-div">
                    <div class="row">
                        <div class="col-lg-12">
                            <!--<pagination @per-page="pagination.perPage"
                            v-model="pagination.page.go" 
                            :records="filtered.go.length" 
                            @paginate="displayResults('go')"/>-->
                            <gene-ontology :goData="pagination.chunk.go" :bait="bait"/>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8 table-cell-div">
                    <vis-network :graph="graph" :goTerms="filtered.go" :bait="bait"/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-5">
                <pie-chart :pData="piechart.data"/>
            </div>
            <div class="col-lg-2"></div>
            <div class="col-lg-5">
                <div class="row">
                    <div class="col-lg-12">
                        <pagination @per-page="pagination.perPage" 
                        v-model="pagination.page.pc" 
                        :records="filtered.pc.length" 
                        @paginate="displayResults('pc')"/>
                        <protein-complex :pcData="pagination.chunk.pc" :bait="bait"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script>
import axios from "axios"
import GeneOntology from './GeneOntology.vue';
import Pagination from "vue-pagination-2"
import {enrichedGenes, enrichedGOdata, enrichedPCdata, graphsBP, graphsCC, baits} from "../../../enrichedData.json"
import ProteinComplex from './ProteinComplex.vue'
import VisNetwork from "./VisNetwork.vue"
import PieChart from './PieChart.vue';

export default {
    components: { 
        GeneOntology,
        Pagination,
        ProteinComplex,
        VisNetwork,
        PieChart,
    },
    data () {
        return {
            piechart: {
                data: {},
            },
            graph: [],
            graphs: {
                graphsCC,
                graphsBP
            },
            bait: "",
            availableOnt: [
                "CC",
                "BP"
            ],
            ontology: "BP",
            baits,
            pagination: {
                perPage: 25,
                chunk: {
                    go: [],
                    pc: [],
                },
                page: {
                    go: 1,
                    pc: 1
                },
                options: {
                    texts: {

                    }
                }
            },
            filters: {
                bait: "E",
                ont: "BP",
                lengthForBaits: 0,
                nodeLength: 5,
            },
            filtered: {
                go: [],
                pc: []
            },
        }
    },
    watch: {
    },
    computed: {
        enrichedPCdata () {
            var unduplicatedEnrichedPCdata = enrichedPCdata
            .filter((el,i,a) => { // get unique pcTerms with filters applied
                var pcID = el.pcID
                if (a.map(e => {return e.pcID}).indexOf(pcID) === i && el.pcCount > 1) { //this line allows to retrieve only the unique pcTerms
                    return el
               }
            })
            .map(PCterm => { // generate the genes property with unique genes
                var pcID = PCterm.pcID
                //get the genes for the term
                var PCterms = enrichedPCdata.filter(t => t.pcID === pcID && t.bait === PCterm.bait) //retrieve all pcTerms with the same pcID
                PCterm.genes = PCterms.map(t => {
                    return {
                        uniqueness: t.uniqueness,
                        uniprotID: t.uniprotID,
                        geneName: t.geneName
                    }
                })
                return PCterm
            })
            return unduplicatedEnrichedPCdata
        },
        enrichedGOdata () {
            enrichedGOdata.forEach(term => {
                //retrieve the list of genes for each GOterms
                var GOterms = enrichedGenes.filter(gene => gene.goID == term._row);
                term.genes = GOterms.map(GOterm => {
                    return {
                        uniprotID: GOterm.uniprotID,
                        uniqueness: GOterm.uniqueness.split("|"),
                        geneSymbol: GOterm.GeneName
                    }
                });
                //add custom properties if needed
                term.isActive = false
            })
            return enrichedGOdata
        }
    },
    methods: {
        goFilter() {
            this.filterData("pc");
            this.filterData("go");
            this.filterGraphs();
        },
        filterData(term) {
            this.filtered[term] = this[`enriched${term.toUpperCase()}data`].filter(el => {
                if (term == 'pc') {
                    return el.bait.toLowerCase() == this.bait.toLowerCase()
                } else {
                    return el.bait.toLowerCase() == this.bait.toLowerCase() && el.ont == this.ontology
                }
            })
            // sort results
            if (term == "pc") {
                this.filtered[term] = this.filtered[term].sort((a,b) => b.pcCount - a.pcCount)
            }
            this.displayResults(term)
        },
        filterGraphs() {
            this.graph = this.graphs[`graphs${this.ontology}`][this.bait]
        },
        displayResults (term) {
            var chunk = this.pagination.perPage
            var start = (this.pagination.page[term]*chunk)-chunk
            var end = start+chunk
            this.pagination.chunk[term] = this.filtered[term].slice(start,end)
        },
        toggleInputs (swtch) {
            let inputs = "#lengthForBaits, #nodeLength, #fingerprintBtn"
            if (swtch) {
                $(inputs).prop("disabled", false)

            } else {
                $(inputs).prop("disabled", true)
            }
        },
        fingerprint () {  
            this.toggleInputs(false)
            axios.post("http://127.0.0.1:8048/fingerprint", {
                length: this.filters.lengthForBaits,
                nodeLength: this.filters.nodeLength
            })
                .then(res => {
                    console.log(res)
                    this.enrichedData = res.data;
                    var dataStr = JSON.stringify(res.data)
                    this.toggleInputs(true)
                })
                .catch(err => {
                    console.log("error:", err)
                })
            
        },
    }
}
</script>