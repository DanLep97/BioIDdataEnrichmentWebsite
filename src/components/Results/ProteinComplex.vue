<template>
    <div>
        <div class="well well-sm">
            <h3 class="text-center">Protein complex enrichment for <strong>{{bait}}</strong> protein</h3>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th class="go-td">Protein Complex name</th>
                        <th class="go-td">Protein Complex ID</th>
                        <th class="go-td">UniprotID</th>
                        <th class="go-td">Listed gene count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(term, i) in pcData" :key="i">
                        <td class="go-td">{{term.pcID}}</td>
                        <td class="go-td">{{term.complexName}}</td>
                        <td class="go-td">
                            <div class="go-flex-td">
                                <div v-for="(gene,i) in term.genes" :key="gene+i">
                                    <a class="genesymbol" :class="[gene.uniqueness.includes('duplicated') ? 'redundant': 'unique']" 
                                    :href="`https://www.uniprot.org/uniprot/${gene.uniprotID}`" target="_blank">
                                        {{gene.geneName}}
                                    </a>
                                </div>
                            </div>
                        </td>
                        <td class="go-td">{{term.pcCount}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script>
export default {
    props: ["pcData", "bait"]
}
</script>