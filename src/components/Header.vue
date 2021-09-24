<template>
    <div class="header">
        <div class="site-title">
            <span class="logo"><img src="/images/logo.png" class="logo" alt="" height="100"/></span>
            <span>SARS-CoV-2 proximal interactome enhanced enrichment</span>
            
        </div>
        
        <!-- <div class="nav-links">
            <span class="nav-link">PRISM</span>
            <span class="nav-link nav-about">About</span>
        </div> -->
    </div>    
</template>
<script>
export default {
    
}
</script>
<style scoped>
.nav-links {
    background-color: red;
    padding: 0.1em 1em;
}
.nav-link {
    font-size: 25px;
}
.nav-link:hover {
    font-weight: 900;
    cursor: pointer;
}

.nav-about {
    float: right;
}
.nav-about::before {
    content: "";
    display: inline;
}
.header {
    padding: 1em;
    margin-bottom: 3em;
}
.site-title {
    text-align: center;
    font-weight: 900;
    font-size: 40px;
    display: flex;
    justify-content: center;
}
</style>