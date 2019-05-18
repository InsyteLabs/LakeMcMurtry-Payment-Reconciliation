'use strict';

const axios = require('axios'),
      conf  = require('../conf').checkfront;

axios.defaults.headers.common['Authorization'] = `Basic ${ conf.token }`;

async function getAccount(){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/account`,
            responseType: 'json'
        });

        return res.data
    }
    catch(e){ throw e }
}

async function getItems(){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/item`,
            responseType: 'json'
        });

        return res.data;
    }
    catch(e){ throw e }
}

async function getItem(id){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/item/${ id }`,
            responseType: 'json'
        });

        return res.data;
    }
    catch(e){ throw e }
}

async function getEvents(){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/item`,
            responseType: 'json'
        });

        return res.data;
    }
    catch(e){ throw e }
}

/*
    GET BOOKINGS
    ------------
    Recursively calls itself until all pages are consumed
*/
async function getBookings(page=1, bookings=[]){
    try {
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/booking?created_date=${ '>1546322400' }&limit=250&page=${ page }`,
            responseType: 'json'
        });

        const newBookings = Object.keys(res.data['booking/index'])
            .map(key => res.data['booking/index'][key]);

        bookings = [...bookings, ...newBookings];

        console.log(res.data.request);

        if(res.data.request.page < res.data.request.pages){
            return await getBookings(res.data.request.page + 1, bookings);
        }

        return bookings;
    }
    catch(e){ throw e }
}

async function getBooking(id){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/booking/${ id }`,
            responseType: 'json'
        });

        return res.data;
    }
    catch(e){ throw e }
}

module.exports = {
    getAccount,
    getItems,
    getItem,
    getEvents,
    getBookings,
    getBooking
}
