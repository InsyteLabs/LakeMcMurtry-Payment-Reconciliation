<template lang="html">
    <div class="bookings container">
        <month-year-filter @filter-change="loadBookings"></month-year-filter>

        <h1>Showing {{ bookings.length }} bookings created in {{ months[month] }} {{ year }}</h1>
        <div class="table-scroll mb-5">
            <table class="mb-0">
                <thead>
                    <tr>
                        <th>Created</th>
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
                    <tr v-for="booking of bookings">
                        <td class="no-wrap">{{ formatDate(booking.created) }}</td>
                        <td>{{ booking.startDate }}</td>
                        <td>{{ booking.endDate }}</td>
                        <td class="summary"><div v-html="formatSummary(booking.summary)"></div></td>
                        <td>{{ booking.status }}</td>
                        <td>{{ booking.customer.name }}</td>
                        <td>{{ booking.customer.email }}</td>
                        <td>${{ booking.total.toFixed(2) }}</td>
                        <td>${{ booking.paidTotal.toFixed(2) }}</td>
                        <td>
                            <button @click="viewDetail(booking.id)" class="btn-block bg-green-dark text-yellow-light" type="button" role="button">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <h1>Showing {{ transactions.length }} transactions in {{ months[month] }} {{ year }}</h1>
        <div class="table-scroll">
            <table class="mb-0">
                <thead>
                    <tr>
                        <th>Booking</th>
                        <th>Transaction ID</th>
                        <th>Transaction Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Gateway</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaction of transactions" :class="{ refund: transaction.status === 'REFUND' }">
                        <td>{{ transaction.bookingId }}</td>
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.date }}</td>
                        <td>{{ transaction.status }}</td>
                        <td>${{ transaction.amount }}</td>
                        <td>{{ transaction.gateway }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script>
'use strict';

import MonthYearFilter from '@/components/MonthYearFilter.vue';
import { formatDate }  from '../utilities';

export default {
    name: 'bookings',
    data(){
        return {
            month: '',
            year:  '',
            months: {
                1:  'January',
                2:  'February',
                3:  'March',
                4:  'April',
                5:  'May',
                6:  'June',
                7:  'July',
                8:  'August',
                9:  'September',
                10: 'October',
                11: 'November',
                12: 'December'
            }
        }
    },
    computed: {
        bookings(){
            return this.$store.getters.bookings;
        },
        transactions(){
            return this.$store.getters.transactions;
        }
    },
    methods: {
        loadBookings(e){
            const { month, year } = e;

            this.month = month;
            this.year  = year;

            this.$store.dispatch('loadBookings', { month, year });
        },
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
        },
        formatDate
    },
    components: { MonthYearFilter }
}
</script>

<style lang="sass" scoped>

.no-wrap
    white-space: nowrap

#filter-btn
    margin-top: 10px

.table-scroll
    max-height: 450px
    overflow-y: auto
    margin-bottom: 50px

.filter-row
    margin-top: -50px
    margin-bottom: 50px

.refund
    color: red

</style>
