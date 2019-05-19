'use strict';

const axios = require('axios'),
      conf  = require('../conf').checkfront;

const Item = require('../Models/Item');

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

        let items = res.data.items;

        items = Object.keys(items)
            .map(key => new Item(items[key]))
            // Sort by category, then by name
            .sort((a, b) => {
                if(a.category === b.category){
                    /*
                        Pick and sort number-like names like "Site #1"
                        Ensures that "Site #10" comes at the end, not right after
                        "Site #1"
                    */
                    if(/[0-9]/.test(a.name) && /[0-9]/.test(b.name)){
                        const aName = parseInt(a.name.replace(/\D/g, '')),
                              bName = parseInt(b.name.replace(/\D/g, ''));

                        return aName - bName;
                    }
                    return a.name > b.name ? 1 : -1;
                }
                return a.category > b.category ? 1 : -1;
            });

        return items;
    }
    catch(e){ throw e }
}

async function getCategories(){
    const items = await getItems();

    const ids = [], categories = [];

    items.forEach(item => {
        if(!~ids.indexOf(item.categoryId)){
            ids.push(item.categoryId);
            categories.push({
                id: item.categoryId,
                name: item.category
            });
        }
    });

    return categories;
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

        if(!newBookings.length) return bookings;

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
    getCategories,
    getEvents,
    getBookings,
    getBooking
}
