<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="well well-sm">
                <h3 class="text-center">Gene ontology for <strong>{{bait}}</strong> protein</h3>
                <div id="go-table">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th class="go-td">Gene ontology ID</th>
                                <th class="go-td">Gene ontology term</th>
                                <th class="go-td">Gene Symbol</th>
                                <th class="go-td">Fisher-Weight algorithm score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(term, i) in goData" :key="i" 
                            :class="{'success': term.isActive}" class="go-element"
                            v-on:click="zoomOnMap(term.goID)">
                                <td class="go-td"><a :href=" 'https://www.ebi.ac.uk/QuickGO/term/' + term.goID" target="_blank">{{term.goID}}</a></td>
                                <td class="go-td">{{term.term}}</td>
                                <td class="go-td">
                                    <div class="col-lg-4" v-for="(gene,i) in term.genes" :key="gene.uniprotID+i">
                                        <a class="genesymbol"
                                        :class="[gene.uniqueness.includes('duplicated') ? 'redundant': 'unique']"
                                        :href=" `https://www.uniprot.org/uniprot/${gene.uniprotID}` " target="_blank">{{gene.geneSymbol}}
                                        </a>
                                    </div>
                                </td>
                                <td class="go-td">{{term.score}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#go-table {
    overflow-y: scroll;
    max-height: 850px;
}
/* .go-titles {
    border-left-width: 1px;
    border-left-color: red;
    border-left-style: solid;
} */

.table>thead>tr>.go-td, .table>tbody>tr>.go-td {
    text-align: center;
    vertical-align: middle;
}

.go-id {
    font-size: 12px;
}

.genesymbol {
    font-size: 13px;
}

.go-element :hover {
    cursor: pointer;
    background-color: #e9f7f7;
}

.unique {
    color: #ff0000;
}
.interm {
    color: #FFA500
}

</style>

<script>

export default {
    props: ["goData", "bait"],
    created() {
        this.$root.$on("highlightTerm", termGOid => {
            this.toggleActive(termGOid)
        })
    },
    methods: {
        toggleActive(goID) {
            var oldActive = this.goData.find(term => term.isActive==true)
            if (oldActive) {
                oldActive.isActive = false
            }
            this.goData.find(term => term.goID == goID).isActive=true
        },
        zoomOnMap(goID) {
            this.$root.$emit("zoomOnMap", goID)
            this.toggleActive(goID)
        }
    }
}
</script>