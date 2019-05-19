'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import api from './api';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        bookings: [],
        bookingDetails: [],
        items: []
    },
    getters: {
        bookings(state){
            return state.bookings;
        },
        booking: state => id => {
            return state.bookings.filter(booking => booking.id === id)[0];
        },
        bookingDetails(state){
            return state.bookingDetails;
        },
        bookingDetail: state => bookingId => {
            return state.bookingDetails.filter(booking => booking.bookingId == bookingId)[0];
        },
        items(state){
            return state.items;
        },
        item: state => id => {
            return state.items.filter(item => item.id === id)[0];
        },
        transactions(state){
            const transactions = [];

            state.bookingDetails.forEach(booking => {
                booking.transactions.forEach(transaction => {

                    const amount = transaction.status.toLowerCase() === 'refund'
                        ? transaction.amount * -1
                        : transaction.amount;

                    transactions.push({
                        id:        transaction.id,
                        bookingId: booking.id,
                        date:      transaction.date,
                        status:    transaction.status,
                        amount:    amount.toFixed(2),
                        gateway:   transaction.gateway
                    });
                });
            });

            return transactions
        }
    },
    mutations: {
        addBooking(state, booking){
            const existing = this.getters.booking(booking.id);

            if(existing){
                const idx = this.getters.bookings.indexOf(existing);

                if(idx >= 0){
                    state.bookings.splice(idx, 1);
                }
            }
            state.bookings.push(booking);
        },
        addBookingDetail(state, detail){
            const existing = this.getters.bookingDetail(detail.bookingId);

            if(existing){
                const idx = this.getters.bookingDetails.indexOf(existing);

                if(idx >= 0){
                    state.bookingDetails.splice(idx, 1);
                }
            }
            state.bookingDetails.push(detail);
        },
        addItem(state, item){
            const existing = this.getters.item(item.id);

            if(existing){
                const idx = this.getters.items.indexOf(item);

                if(idx >= 0){
                    state.items.splice(idx, 1);
                }
            }
            state.items.push(item);
        },
        removeBookings(state){
            state.bookings       = [];
            state.bookingDetails = [];
        }
    },
    actions: {
        async loadBookings({ commit, dispatch }, o={ month:'', year:'' }){
            const bookings = await api.getBookings(o.month, o.year);

            commit('removeBookings');

            bookings.forEach(booking => {
                commit('addBooking', booking);

                dispatch('loadBookingDetail', booking);
            });
        },
        async loadBookingDetail({ commit }, booking){
            const bookingDetail = await api.getBookingDetail(booking.id);

            commit('addBookingDetail', bookingDetail);
        },
        async loadItems({ commit }){
            const items = await api.getItems();

            items.forEach(item => {
                commit('addItem', item);
            });
        }
    }
});

store.dispatch('loadBookings');
store.dispatch('loadItems');


export default store;
