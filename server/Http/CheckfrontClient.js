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
async function getBookings(month, year, page=1, bookings=[]){

    if(!(month && year)){
        const date = new Date();

        month = date.getMonth() + 1;
        year  = date.getFullYear();
    }
    try {

        const reqDate  = new Date(`${ month }/01/${ year }`),
              reqStamp = reqDate.getTime() / 1000;

        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/booking?created_date=${ '>' + reqStamp }&limit=250&page=${ page }`,
            responseType: 'json'
        });

        const newBookings = Object.keys(res.data['booking/index'])
            .map(key => res.data['booking/index'][key]);

        const firstCreatedDate = new Date(newBookings[0].created_date * 1000);
        if(firstCreatedDate.getMonth() + 1 > month){
            bookings = [...bookings, ...newBookings];
            return bookings.filter(booking => {
                const createdMonth = (new Date(booking.created_date * 1000)).getMonth() + 1;

                return createdMonth > month ? false : true;
            });
        }

        bookings = [...bookings, ...newBookings];

        if(res.data.request.page < res.data.request.pages){
            return await getBookings(month, year, res.data.request.page + 1, bookings);
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
