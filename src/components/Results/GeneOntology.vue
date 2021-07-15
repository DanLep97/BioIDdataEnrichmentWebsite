<template>
    <div>
        <div class="well well-sm">
            <h3 class="text-center">Gene ontology for <strong>{{bait}}</strong> protein</h3>
            <div id="go">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th class="go-td">Gene Ontology ID</th>
                            <th class="go-td">Gene Ontology Term</th>
                            <th class="go-td">Gene Symbol</th>
                            <th class="go-td">Fisher-Weight Algorithm Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(term, i) in goData" :key="i"
                        :class="{'success': term.isActive}" class="go-element"
                        v-on:click="zoomOnMap(term.goID)">
                            <td class="go-td"><a :href=" 'https://www.ebi.ac.uk/QuickGO/term/' + term.goID" target="_blank">{{term.goID}}</a></td>
                            <td class="go-td">{{term.term}}</td>
                            <td class="go-td">
                                <div class='go-flex-td'>
                                    <div class="go-flex-td-item" v-for="(gene,i) in term.genes" :key="gene.uniprotID+i">
                                        <a class="genesymbol"
                                        :class="[gene.uniqueness.includes('duplicated') ? 'redundant': 'unique']"
                                        :href=" `https://www.uniprot.org/uniprot/${gene.uniprotID}` " target="_blank">{{gene.geneSymbol}}
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td class="go-td">{{term.score}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
#go {
    overflow-y: auto;
    max-height:851px;
}
</style>

<style>

table>thead>tr>.go-td, table>tbody>tr>.go-td {   
    text-align: center;
    vertical-align: middle;
    width:20%; 
}

table>tbody>tr>td>.go-flex-td {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-column-gap: 1em;
}
table>tbody>tr>td>.go-flex-td-item {
    grid-column-start: auto;
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
    color: #FFA500;
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
        }
    }
}
</script>