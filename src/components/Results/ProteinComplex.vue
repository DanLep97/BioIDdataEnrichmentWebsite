<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="well well-sm">
                <h3 class="text-center">Protein complex enrichment for <strong>{{bait}}</strong> protein</h3>
                <ul class="list-group">
                        <div class="row">
                            <div class="col-lg-3">Protein Complex ID</div>
                            <div class="col-lg-3">Protein Complex name</div>
                            <div class="col-lg-3">UniprotID</div>
                            <div class="col-lg-3">Listed gene count</div>
                        </div>
                    <li v-for="(term, i) in pcData" :key="i" class="list-group-item">
                        <div class="row">
                            <div class="col-lg-3">{{term.pcID}}</div>
                            <div class="col-lg-3">{{term.complexName}}</div>
                            <div class="col-lg-3">
                                <div class="row">
                                    <div class="col-lg-4" v-for="(gene,i) in term.genes" :key="gene+i">
                                        <a class="genesymbol" :class="[gene.uniqueness.includes('duplicated') ? 'redundant': 'unique']" 
                                        :href="`https://www.uniprot.org/uniprot/${gene.uniprotID}`" target="_blank">
                                            {{gene.geneName}}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3">{{term.pcCount}}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["pcData", "bait"]
}
</script>