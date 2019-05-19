<template>
    <div id="app">
        <Navigation></Navigation>
        <router-view/>
    </div>
</template>

<script>
'use strict';

import Navigation from '@/components/Navigation';

export default {
    name: 'app',
    components: { Navigation }
}
</script>

<style lang="sass">
#app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50


.container
    max-width: 1350px

table
    tr:nth-child(even)
        background-color: rgba(gray, .15)
</style>
