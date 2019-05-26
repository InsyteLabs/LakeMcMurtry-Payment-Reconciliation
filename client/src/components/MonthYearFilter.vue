<template lang="html">
    <div class="container py-0">
        <div class="filter">
            <select class="month filter-item" v-model="month">
                <option v-for="(month, num) in months" :value="num">{{ month }}</option>
            </select>
            <select class="year filter-item" v-model="year">
                <option v-for="year of years" :value="year">{{ year }}</option>
            </select>
            <button
                @click="$emit('filter-change', { month, year })"
                class="bg-green-dark text-yellow-light"
                type="button"
                role="button">
                Filter
            </button>
        </div>
    </div>
</template>

<script>
'use strict';

const date  = new Date(),
      month = date.getMonth() + 1,
      year  = date.getFullYear();

export default {
    name: 'month-year-filter',
    data(){
        return {
            month: month,
            year:  year,
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
            },
            years: (() => {
                const years = [];
                let start = 2012;

                while(start <= year) years.push(start++);

                return years;
            })()
        }
    },
    created(){
        
    }
}
</script>

<style lang="sass" scoped>

.container
    margin-top: -35px
    margin-bottom: 50px

.filter
    text-align: left
    float: right
    .filter-item
        display: inline-block
        float: left
        max-width: 350px
        width: auto
        margin-right: 10px

    button
        width: 75px
</style>
