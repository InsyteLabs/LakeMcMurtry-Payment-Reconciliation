<template lang="html">
    <div class="settlement container">
        <keep-alive>
            <month-year-filter @filter-change="loadSettlement" @loaded="setDate($event)"></month-year-filter>
        </keep-alive>
        <h1 v-if="month && year" class="text-center">
            Stripe transactions for {{ months[month] }} {{ year }}
        </h1>

        <div v-if="settlement.transactions">
            <div class="">
                <h2>Settlement Totals</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Charges</th>
                            <th>Total Charged Amount</th>
                            <th>Total Fees</th>
                            <th>Refunds</th>
                            <th>Total Refund Amount</th>
                            <th>Gross</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ settlement.totalCharges }}</td>
                            <td>{{ currency(settlement.totalChargedAmount) }}</td>
                            <td>{{ currency(settlement.totalFees) }}</td>
                            <td>{{ settlement.totalRefunds }}</td>
                            <td>{{ currency(settlement.totalRefundAmount) }}</td>
                            <td>{{ currency(settlement.gross) }}</td>
                            <td>{{ currency(settlement.net) }}</td>
                        </tr>
                    </tbody>
                </table>

                <button @click="exportCSV" class="bg-green-dark text-yellow-light">Export CSV</button>

                <hr>
            </div>


            <div v-for="(group, groupName) in settlement.transactions">
                <div v-if="group.transactions.length > 1">
                    <h2>{{ groupName }}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Charges</th>
                                <th>Total Charged Amount</th>
                                <th>Total Fees</th>
                                <th>Refunds</th>
                                <th>Total Refund Amount</th>
                                <th>Gross</th>
                                <th>Net</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ group.totalCharges }}</td>
                                <td>{{ currency(group.totalChargedAmount) }}</td>
                                <td>{{ currency(group.totalFees) }}</td>
                                <td>{{ group.totalRefunds }}</td>
                                <td>{{ currency(group.totalRefundAmount) }}</td>
                                <td>{{ currency(group.gross) }}</td>
                                <td>{{ currency(group.net) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Booking</th>
                                <th>Amount</th>
                                <th>Fee</th>
                                <th>Net</th>
                                <th>Cardholder</th>
                                <th>Receipt</th>
                                <th>Category</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="transaction of group.transactions" :class="{ refund: transaction.type === 'refund' }">
                                <td>{{ formatDate(transaction.transactionDate) }}</td>
                                <td>{{ transaction.type[0].toUpperCase() + transaction.type.slice(1) }}</td>
                                <td>{{ transaction.status[0].toUpperCase() + transaction.status.slice(1) }}</td>
                                <td>
                                    <router-link :to="'/bookings/' + transaction.bookingId">{{ transaction.bookingCode }}</router-link>
                                </td>
                                <td>{{ currency(transaction.amount) }}</td>
                                <td>{{ currency(transaction.fee) }}</td>
                                <td>{{ currency(transaction.net) }}</td>
                                <td>{{ transaction.cardHolderName }}</td>
                                <td>
                                    <div v-if="transaction.receiptURL">
                                        <a :href="transaction.receiptURL" target="_blank" rel="noopener nofollow">View Receipt</a>
                                    </div>
                                    <div v-else>
                                        N/A
                                    </div>
                                </td>
                                <td>{{ transaction.categories.join(', ') }}</td>
                                <td>{{ transaction.items.join(', ') }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
'use strict';

import MonthYearFilter from '@/components/MonthYearFilter.vue';
import { formatDate, currency }  from '../utilities';

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
        setDate(e){
            const [ month, year ] = e;
            this.month = month;
            this.year  = year;
        },
        loadSettlement(e){
            const { month, year } = e;

            this.month = month;
            this.year  = year;

            this.$store.commit('removeSettlement');
            this.$store.dispatch('loadSettlement', { month, year });
        },
        exportCSV(){
            let data = [
                `Date, Booking Code, Type, Status, Amount, Fee, Net, Category, Categories, Items`
            ];

            for(let groupName in this.settlement.transactions){
                const { transactions } = this.settlement.transactions[groupName];

                for(let transaction of transactions){
                    const {
                        bookingCode,
                        transactionDate,
                        type,
                        status,
                        amount,
                        fee,
                        net,
                        categories,
                        items
                    } = transaction;

                    data.push([
                        `"${ formatDate(transactionDate) }"`,
                        `"${ bookingCode }"`,
                        `"${ type[0].toUpperCase() }${ type.slice(1) }"`,
                        `"${ status[0].toUpperCase() }${ status.slice(1) }"`,
                        `"${ amount || '0.00' }"`,
                        `"${ fee || 'N/A' }"`,
                        `"${ net || 'N/A' }"`,
                        `"${ groupName }"`,
                        `"${ categories.join(', ').replace(/"/g, '""') }"`,
                        `"${ items.join(', ').replace(/"/g, '""') }"`
                    ].join(','));
                }
            }

            data = data.join('\n');
            data = btoa(data);

            const url = `data:text/csv;base64,${ data }`;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `${ this.months[this.month] }-${ this.year }_stripe-settlement.csv`
            );

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        formatDate,
        currency
    },
    components: { MonthYearFilter }
}
</script>

<style lang="sass" scoped>

a
    color: #2c3e50
    &:visited
        color: lighten(#2c3e50, 15%)
.refund
    color: red
</style>
