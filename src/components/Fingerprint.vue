<template>
    <div>
        <div>
            <input type="text" v-model="filters.lengthForBaits">
            <button v-on:click="fingerprint">Fingerprint!</button>
        </div>
        <div>
            <input type="text" v-model="filters.bait">
            <button v-on:click="filterData">FilterGenes!</button>
            <pagination @per-page="pagination.perPage" v-model="pagination.page" :records="filtered.terms.length" @paginate="displayResults('terms')"/>
            <ul class="list-group">
                    <div class="row">
                        <div class="col-lg-3">Gene ontology ID</div>
                        <div class="col-lg-3">Gene ontology term</div>
                        <div class="col-lg-3">UniprotID</div>
                        <div class="col-lg-3">Ontology/Protein Complex</div>
                    </div>
                <li v-for="(term, i) in pagination.chunk.terms" :key="i" class="list-group-item">
                    <div class="row">
                        <div class="col-lg-3">{{term._row}}</div>
                        <div class="col-lg-3">{{term.term}}</div>
                        <div class="col-lg-3">
                            <div class="row">
                                <div class="col-lg-4" v-for="gene in term.genes" :key="gene.uniprotID">
                                    {{gene.uniprotID}}
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3">{{term.ont}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import {enrichedGenes, superEnrichedData} from "../../enrichedData.json"
import Pagination from "vue-pagination-2"
export default {
    components: {
        Pagination,
    },
    data () {
        return {
            pagination: {
                perPage: 25,
                chunk: {
                    genes: [],
                    terms: [],
                },
                page: 1,
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
                terms: [],
            },
            enrichedGenes,
            superEnrichedData
        }
    },
    created () {
        this.associateGenesToTerms();
    },
    methods: {
        associateGenesToTerms () {
            this.superEnrichedData.forEach(term => {
                var genes = enrichedGenes.filter(gene => gene.goID == term._row);
                term.genes = genes;
            })
        },
        displayResults () {
            var chunk = this.pagination.perPage
            var start = (this.pagination.page*chunk)-chunk
            var end = start+chunk
            console.log(chunk,start,end)
            this.pagination.chunk.terms = this.filtered.terms.slice(start,end)
        },
        filterData() {
            this.filtered.terms = this.superEnrichedData.filter(el => 
                el.bait.toLowerCase() == this.filters.bait.toLowerCase()
            )
            this.displayResults()
        },
        fingerprint () {      
            axios.post("http://127.0.0.1:8048/fingerprint", {length: this.filters.length})
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