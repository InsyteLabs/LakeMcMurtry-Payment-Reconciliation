<template lang="html">
    <nav id="nav" class="mb-5">
        <div class="container py-0">
            <img id="logo" src="../assets/logo.png" alt="LakeMcMurtry Logo">

            <ul class="links">
                <li>
                    <router-link to="/" class="link">Home</router-link>
                </li>
                <li>
                    <router-link to="/items" class="link">Items</router-link>
                </li>
                <li>
                    <router-link to="/bookings" class="link">Bookings</router-link>
                </li>
                <li>
                    <router-link to="/stripe-settlement" class="link">Stripe Settlement</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'navigation'
}
</script>

<style lang="sass" scoped>

nav
    position: relative
    display: block
    width: 100%
    border-bottom: 1px solid rgba(0,0,0,.25)

    a
        text-decoration: none
        font-size: 2rem
        font-weight: bold
        color: #2c3e50
        &.router-link-exact-active
            color: green

        &:hover
            text-decoration: underline

    #logo
        max-width: 80px
        float: left
        margin: 8px 0

    .links
        float: right
        margin: 0
        padding: 0
        list-style-type: none

        li
            margin: 0
            padding: 0
            display: inline-block
            float: left

    .link
        display: inline-block
        padding: 35px 25px

    &::after
        content: ''
        display: block
        width: 100%
        clear: both
</style>
