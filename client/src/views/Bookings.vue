<template lang="html">
    <div class="bookings container">
        <table>
            <thead>
                <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th style="max-width: 150px">Summary</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="booking in bookings">
                    <td>{{ booking.startDate }}</td>
                    <td>{{ booking.endDate }}</td>
                    <td class="summary"><div v-html="formatSummary(booking.summary)"></div></td>
                    <td>{{ booking.status }}</td>
                    <td>{{ booking.customer.name }}</td>
                    <td>{{ booking.customer.email }}</td>
                    <td>${{ booking.total.toFixed(2) }}</td>
                    <td>${{ booking.paidTotal.toFixed(2) }}</td>
                    <td>
                        <button @click="viewDetail(booking.id)" class="btn-block btn-primary" type="button" role="button">View</button>
                    </td>
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
    },
    methods: {
        viewDetail(bookingId){
            this.$router.push({
                name: 'bookingDetail',
                params: { bookingId }
            });
        },
        formatSummary(text){
            text = text
                // Strip dangerous angle brackets
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .split(/,\w?/)
                .map(item => `<span>${ item }</span>`)
                .join('<br>');

            return text;
        }
    }
}
</script>

<style lang="sass" scoped>

.container
    max-width: 1350px

</style>
