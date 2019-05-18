'use strict';

import Vue    from 'vue';
import Router from 'vue-router';

import Home          from './views/Home.vue';
import Bookings      from './views/Bookings.vue';
import BookingDetail from './views/BookingDetail.vue';
import Items         from './views/Items';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior(to, from, saved){
        if(saved) return saved;

        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/bookings',
            name: 'bookings',
            component: Bookings
        },
        {
            path: '/bookings/:bookingId',
            name: 'bookingDetail',
            props: true,
            component: BookingDetail
        },
        {
            path: '/items',
            name: 'items',
            component: Items
        }
    ]
});
