<template lang="html">
    <div class="container">
        <h1 class="text-center">Items</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Category</th>
                    <th>Category ID</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.sku }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.visibility }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.categoryId }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
'use strict';

export default {
    name: 'items',
    computed: {
        items(){
            return this.$store.state.items;
        }
    }
}

</script>

<style lang="sass" scoped>

.container
    max-width: 1350px
</style>
