<template lang="html">
    <div class="settlement container">
        <keep-alive>
            <month-year-filter @filter-change="loadSettlement"></month-year-filter>
        </keep-alive>
        <h1 class="text-center">
            {{ settlement.length }} Stripe transactions for {{ months[month] }} {{ year }} totaling ${{ total }}
        </h1>

        <div v-for="group of groupedTransactions">
            <h3 class="text-center">{{ group.category }}</h3>
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
                    <tr v-for="transaction of group.transactions">
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
        settlement(){ return this.$store.getters.settlement },
        total(){
            const transactions = this.$store.getters.settlement;

            return transactions.reduce((acc, transaction) => {
                if(transaction.status === 'REFUND'){
                    console.log('Caught refund');
                    acc -= transaction.amount;
                }
                else{
                    acc += transaction.amount;
                }

                return acc;
            }, 0);
        },
        groupedTransactions(){
            const transactions = this.$store.getters.settlement,
                  grouped      = [
                      { category: 'Tent Camping',        transactions: [] },
                      { category: 'RV Camping',          transactions: [] },
                      { category: 'Annual Memberships',  transactions: [] },
                      { category: 'Day Permits',         transactions: [] },
                      { category: 'Pavilion Rentals',   transactions: [] },
                      { category: 'Mulitple Categories', transactions: [] }
                  ];

            const categoryMap = {
                'East Tent Campsites': 'Tent Camping',
                'West Tent Campsites': 'Tent Camping',

                'Primitive Campsites': 'Primitive Camping',

                'East RV Campsites': 'RV Camping',
                'West RV Campsites': 'RV Camping',

                'Annual Membership': 'Annual Memberships',
                'Day Permit':        'Day Permits',

                'Pavilion Rental': 'Pavilion Rentals'
            }

            transactions.forEach(transaction => {
                if(transaction.multipleCategories){
                    grouped[5].transactions.push(transaction);
                }
                const existing = grouped.filter(group => {
                    let category = categoryMap[transaction.categories[0]];

                    return group.category === category;
                })[0];

                if(existing){
                    existing.transactions.push(transaction);
                }
                else{
                    grouped.push({
                        category:     categoryMap[transaction.categories[0]],
                        transactions: [ transaction ]
                    });
                }
            });

            return grouped;
        }
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
