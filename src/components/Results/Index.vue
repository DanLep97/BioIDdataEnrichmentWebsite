<template>
    <div>
        <div class="row">
            <input type="text" v-model="filters.lengthForBaits">
            <button v-on:click="fingerprint">Fingerprint!</button>
        </div>
        <div class="row">
            <div class="col-lg-5"></div>
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
            <div class="col-lg-3"><button v-on:click="goFilter">GO!</button></div>
        </div>
        <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-6">
                <vis-network :graph="graph" :bait="bait"/>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-5">
                <div class="row">
                    <div class="col-lg-12">
                        <pagination @per-page="pagination.perPage"
                        v-model="pagination.page.go" 
                        :records="filtered.go.length" 
                        @paginate="displayResults('go')"/>
                        <gene-ontology :goData="pagination.chunk.go" :bait="bait"/>
                    </div>
                </div>
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

<script>
import axios from "axios"
import GeneOntology from './GeneOntology.vue';
import Pagination from "vue-pagination-2"
import {enrichedGenes, enrichedGOdata, enrichedPCdata, graphs, baits} from "../../../enrichedData.json"
import ProteinComplex from './ProteinComplex.vue'
import VisNetwork from "./VisNetwork.vue"

export default {
    components: { 
        GeneOntology,
        Pagination,
        ProteinComplex,
        VisNetwork,
    },
    data () {
        return {
            graph: [],
            graphs,
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
            var unduplicatedEnrichedPCdata = enrichedPCdata.filter((el, i, a) => {
               var pcID = el.pcID
               var PCterms = enrichedPCdata.filter(pcTerm => pcTerm.pcID === pcID) //retrieve all pcTerms with the same pcID
               el.genes = PCterms.map(pcTerm => pcTerm.uniprotID) // genes are the uniprotID of the found pcTerms
               if (a.map(e => {return e.pcID}).indexOf(pcID) === i) { //this line allows to retrieve only the unique pcTerms
                   return el
               }
            })
            return unduplicatedEnrichedPCdata
        },
        enrichedGOdata () {
            enrichedGOdata.forEach(term => {
                //retrieve the list of genes for each GOterms
                var GOterms = enrichedGenes.filter(gene => gene.goID == term._row);
                term.genes = GOterms.map(term => term.uniprotID);
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
            this.displayResults(term)
        },
        filterGraphs() {
            this.graph = graphs[this.bait]
        },
        displayResults (term) {
            var chunk = this.pagination.perPage
            var start = (this.pagination.page[term]*chunk)-chunk
            var end = start+chunk
            this.pagination.chunk[term] = this.filtered[term].slice(start,end)
        },
        fingerprint () {  
            axios.post("http://127.0.0.1:8048/fingerprint", {length: this.filters.lengthForBaits})
                .then(res => {
                    console.log(res)
                    this.enrichedData = res.data;
                    var dataStr = JSON.stringify(res.data)
                    console.log(dataStr)
                })
                .catch(err => {
                    console.log("error:", err)
                })
            
        },
    }
}
</script>