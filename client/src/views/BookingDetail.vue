<template lang="html">
    <div class="container booking-detail">
        <h3 class="text-center">Booking Info</h3>
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Paid</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ bookingId }}</td>
                    <td>{{ detail.startDate }}</td>
                    <td>{{ detail.endDate }}</td>
                    <td>{{ detail.statusId }}</td>
                    <td>${{ detail.total.toFixed(2) }}</td>
                    <td>${{ detail.amountPaid.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>

        <h3>Customer Info</h3>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ detail.customer.name }}</td>
                    <td>{{ detail.customer.email }}</td>
                    <td>{{ detail.customer.phone }}</td>
                    <td>{{ detail.customer.address }}</td>
                    <td>{{ detail.customer.city }}</td>
                    <td>{{ detail.customer.state }}</td>
                    <td>{{ detail.customer.zip }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
'use strict';

export default {
    name: 'bookingDetail',
    props: [ 'bookingId' ],
    computed: {
        detail(){
            const detail = this.$store.getters.bookingDetail(this.bookingId) || {};

            detail.total      = detail.total      || 0;
            detail.amountPaid = detail.amountPaid || 0;
            detail.customer   = detail.customer   || {};

            return detail;
        }
    },
    created(){
        this.$store.dispatch('loadBookingDetail', { id: this.bookingId });
    }
}

</script>

<style lang="sass" scoped>

</style>
