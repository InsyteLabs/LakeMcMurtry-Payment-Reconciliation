<template lang="html">
    <div class="bookings">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th style="max-width: 150px">Summary</th>
                    <th>Date Desc</th>
                    <th>Status</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Total</th>
                    <th>Amount Paid</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in bookings">
                    <td>{{ booking.id }}</td>
                    <td>{{ booking.code }}</td>
                    <td style="max-width: 150px">{{ booking.summary }}</td>
                    <td>{{ booking.dateDesc }}</td>
                    <td>{{ booking.status }}</td>
                    <td>{{ booking.customer.name }}</td>
                    <td>{{ booking.customer.email }}</td>
                    <td>${{ booking.total.toFixed(2) }}</td>
                    <td>${{ booking.paidTotal.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script>
'use strict';

export default {
    name: 'bookings',
    computed: {
        bookings(){
            return this.$store.getters.bookings;
        }
    }
}
</script>

<style lang="sass" scoped>

</style>
