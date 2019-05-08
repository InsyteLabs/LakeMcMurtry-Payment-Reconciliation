'use strict';

import Vue  from 'vue';
import Vuex from 'vuex';

import api from './api';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        bookings: [],
        bookingDetails: []
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
                const idx = this.getters.bookingDetails.indexOf(detail);

                if(idx >= 0){
                    state.bookingDetails.splice(idx, 1);
                }
            }
            state.bookingDetails.push(detail);
        }
    },
    actions: {
        async loadBookings({ commit, dispatch }){
            const bookings = await api.getBookings();

            bookings.forEach(booking => {
                commit('addBooking', booking);

                dispatch('loadBookingDetail', booking);
            });
        },
        async loadBookingDetail({ commit }, booking){
            const bookingDetail = await api.getBookingDetail(booking.id);

            commit('addBookingDetail', bookingDetail);
        }
    }
});

store.dispatch('loadBookings');

export default store;