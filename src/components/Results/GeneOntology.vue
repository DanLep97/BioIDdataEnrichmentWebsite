<template>
    <div>
        <div class="table-container">
            <h3 class="table-title">Gene ontology for <strong>{{bait}}</strong> protein</h3>
            <div id="go">
                <table class="table-table">
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
.table-container {
    width: 100%;
    background-color:wheat;
    margin: 0;
    padding: 0.1em 1em 1em 1em
}

.table-title {
    text-align: center;
}

.table-table {
    border-collapse: collapse;
    border-spacing: 0;
    background-color: white;
}
.table-table thead {
    background-color: #e4edeb;
}
.table-table td, .table-table th {
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-left: 1px solid #e1f0ed;
    padding: 5px;
}
</style>

<style>

table>thead>tr>.go-td, table>tbody>tr>.go-td {   
    text-align: center;
    vertical-align: middle;
    width:20%; 
}

table>tbody>tr>td>.go-flex-td {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
table>tbody>tr>td>.go-flex-td-item {
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