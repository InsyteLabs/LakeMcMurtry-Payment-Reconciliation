<template lang="html">
    <div class="container booking-detail">
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <h3 class="text-center">Booking Info</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Booking ID</th>
                                <td>{{ bookingId }}</td>
                            </tr>
                            <tr>
                                <th>Start Date</th>
                                <td>{{ detail.startDate }}</td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>{{ detail.endDate }}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{{ detail.statusId }}</td>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <td>${{ detail.total.toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <th>Paid</th>
                                <td>${{ detail.amountPaid.toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-6">
                <div class="card">
                    <h3>Customer Info</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{{ detail.customer.name }}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{{ detail.customer.email }}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{{ detail.customer.phone }}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{{ detail.customer.address }}</td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>{{ detail.customer.city }}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>{{ detail.customer.state }}</td>
                            </tr>
                            <tr>
                                <th>Zip</th>
                                <td>{{ detail.customer.zip }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <h3>Booking Items</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in detail.items">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.statusId }}</td>
                    <td>{{ item.itemTotal }}</td>
                    <td>{{ item.startDate }}</td>
                    <td>{{ item.endDate }}</td>
                </tr>
            </tbody>
        </table>

        <h3>Transactions</h3>
        <table>
            <thead>
                <tr>
                    <th>Gateway</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>ID</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in detail.transactions">
                    <td>{{ transaction.gateway }}</td>
                    <td>{{ transaction.status }}</td>
                    <td>${{ Number(transaction.amount).toFixed(2) }}</td>
                    <td>{{ transaction.date }}</td>
                    <td>{{ transaction.id }}</td>
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

.card
    padding: 1.6rem 2.4rem

    table
        margin-bottom: 0

        tr:last-child
            border-bottom: none

</style>
