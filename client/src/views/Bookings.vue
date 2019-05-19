<template lang="html">
    <div class="bookings container">
        <h1>Bookings</h1>
        <div class="row">
            <div class="col-2">
                <select id="month" v-model="month">
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
            <div class="col-2">
                <select id="year" v-model="year">
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
            </div>
            <div class="col-1">
                <button @click="loadBookings" class="bg-green-dark text-yellow-light btn-block" id="filter-btn" type="button" role="button">FILTER</button>
            </div>
        </div>
        <table>
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
                <tr v-for="booking in bookings">
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

</template>

<script>
'use strict';

import { formatDate } from '../utilities';

const date  = new Date(),
      month = date.getMonth() + 1,
      year  = date.getFullYear();

export default {
    name: 'bookings',
    data(){
        return {
            month,
            year
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
        loadBookings(){
            this.$store.dispatch('loadBookings', {
                month: this.month,
                year:  this.year
            });
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
    }
}
</script>

<style lang="sass" scoped>

.no-wrap
    white-space: nowrap

#filter-btn
    margin-top: 10px
</style>
