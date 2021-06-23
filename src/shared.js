export default {
    displayResults (term) {
        var chunk = this.pagination.perPage
        var start = (this.pagination.page[term]*chunk)-chunk
        var end = start+chunk
        console.log(chunk,start,end)
        this.pagination.chunk[term] = this.filtered[term].slice(start,end)
    },
}