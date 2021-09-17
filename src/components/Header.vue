<template>
    <div class="header">
        <div class="site-title">
            <span>SARS-CoV-2 proximal interactome enhanced enrichment</span>
            <span class="logo"><img src="/images/logo.png" class="logo" alt="" height="100"/></span>
            
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
.logo {
    position: absolute;
    left: 0.2em;
}
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
}
.site-title {
    text-align: center;
    font-weight: 900;
    font-size: 40px;
}
</style>