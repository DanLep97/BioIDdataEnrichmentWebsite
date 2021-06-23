<template>
    <div class="row">
        <div class="col-lg-12">
            <div class="well well-sm">
                <h3 class="text-center">Gene ontology for <strong>{{bait}}</strong> protein</h3>
                <ul class="list-group">
                        <div class="row">
                            <div class="col-lg-3">Gene ontology ID</div>
                            <div class="col-lg-3">Gene ontology term</div>
                            <div class="col-lg-3">UniprotID</div>
                            <div class="col-lg-3">Fisher-Weight algorithm score</div>
                        </div>
                    <div v-for="(term, i) in goData" :key="i">
                        <li :class="[term.isActive ? 'list-group-item list-group-item-success': 'list-group-item']">
                            <div class="row">
                                <div class="col-lg-3"><a :href=" 'https://www.ebi.ac.uk/QuickGO/term/' + term.goID" target="_blank">{{term.goID}}</a></div>
                                <div class="col-lg-3">{{term.term}}</div>
                                <div class="col-lg-3">
                                    <div class="row">
                                        <div class="col-lg-4" v-for="gene in term.genes" :key="gene">
                                            <a :href=" `https://www.uniprot.org/uniprot/${gene}` " target="_blank">{{gene}}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3">{{term.score}}</div>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ["goData", "bait"],
    created() {
        this.$root.$on("highlightTerm", termGOid => {
            var oldActive = this.goData.find(term => term.isActive==true)
            if (oldActive) {
                oldActive.isActive = false
            }
            this.goData.find(term => term.goID == termGOid).isActive=true
        })
    }
}
</script>