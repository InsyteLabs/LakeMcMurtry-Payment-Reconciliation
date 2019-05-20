<template lang="html">
    <div class="settlement container">
        <keep-alive>
            <month-year-filter @filter-change="loadSettlement"></month-year-filter>
        </keep-alive>
        <h1 class="text-center">
            Showing {{ settlement.length }} transactions for {{ months[month] }} {{ year }}
        </h1>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Gateway</th>
                    <th>Items</th>
                    <th>Categories</th>
                    <th>Booking ID</th>
                    <th>Booking Code</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction of settlement">
                    <td class="no-wrap">{{ formatDate(transaction.date) }}</td>
                    <td>${{ transaction.amount.toFixed(2) }}</td>
                    <td>{{ transaction.status }}</td>
                    <td>{{ transaction.gateway }}</td>
                    <td>{{ transaction.items.join(', ') }}</td>
                    <td>{{ transaction.categories.join(', ') }}</td>
                    <td>
                        <router-link :to="`/bookings/${ transaction.bookingId }`">
                            {{ transaction.bookingId }}
                        </router-link>
                    </td>
                    <td>{{ transaction.bookingCode }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
'use strict';

import MonthYearFilter from '@/components/MonthYearFilter.vue';
import { formatDate }  from '../utilities';

export default {
    name: 'stripe-settlement',
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
        settlement(){ return this.$store.getters.settlement }
    },
    methods: {
        loadSettlement(e){
            const { month, year } = e;

            this.month = month;
            this.year  = year;

            this.$store.commit('removeSettlement');
            this.$store.dispatch('loadSettlement', { month, year });
        },
        formatDate
    },
    components: { MonthYearFilter }
}
</script>

<style lang="sass" scoped>

</style>
