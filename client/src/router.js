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
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
});
