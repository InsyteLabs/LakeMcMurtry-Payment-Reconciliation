'use strict';

const axios = require('axios'),
      conf  = require('../conf').checkfront;

const Item          = require('../Models/Item'),
      Booking       = require('../Models/Booking'),
      BookingDetail = require('../Models/BookingDetail');

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

async function getItemsByCategory(){
    const items = await getItems(),
          cats  = [];

    items.forEach(item => {
        const existing = cats.filter(cat => cat.id === item.categoryId)[0];

        if(!existing){
            cats.push({
                id:    item.categoryId,
                name:  item.category,
                items: [ item.name ]
            });
        }
        else{
            existing.items.push(item.name);
        }
    });

    return cats;
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
            .map(key => res.data['booking/index'][key])
            .map(b => new Booking(b));

        if(!newBookings.length) return bookings;

        // Check if the first recently fetched booking's created month is greater
        // than the requested month. If so, stop recursing and filter out any bookings
        // that were created in months after the requested month
        const firstCreatedDate = newBookings[0].created;;
        if(firstCreatedDate.getMonth() + 1 > month){
            bookings = [...bookings, ...newBookings];
            return bookings.filter(booking => {
                return booking.created.getMonth() + 1 > month ? false : true;
            });
        }

        bookings = [...bookings, ...newBookings];

        if(res.data.request.page < res.data.request.pages){
            return await getBookings(month, year, res.data.request.page + 1, bookings);
        }

        return bookings;
    }
    catch(e){
        console.log(`Error fetching bookings for month ${ month }/${ year }, page ${ page }`);
    }
}

async function getBookingsWithDetails(month, year){
    const bookings = await getBookings(month, year);

    const details = bookings.map(async booking => await getBooking(booking.id));

    return Promise.all(details);
}

async function getBooking(id){
    try{
        const res = await axios({
            method: 'get',
            url: `${ conf.endpoint }/booking/${ id }`,
            responseType: 'json'
        });

        const detail = res.data.booking;

        return new BookingDetail(detail);
    }
    catch(e){
        console.log(`Failed to fetch booking "${ id }"`);
    }
}

async function getSettlementTransactions(month, year){

    let details = await getBookingsWithDetails(month, year);

    // Create a map of category IDs to category names
    const categories  = await getCategories(),
          categoryMap = categories.reduce((map, cat) => {
              map[cat.id] = cat.name;
              return map;
          }, {});

    const allTransactions = [];

    // Loop over each booking, fetch it's details, and collect it's transactions
    details.forEach(detail => {
        let transactions = detail.transactions,
            items        = detail.items;

        // Create a unique set of items and categories for this booking
        const bookedItems      = new Set(),
              bookedCategories = new Set();
        items.forEach(item => {
            bookedItems.add(item.name);
            bookedCategories.add(categoryMap[item.categoryId]);
        });

        transactions.forEach(transaction => {
            // FIlter out non-stripe transaction
            if(transaction.gateway.toLowerCase() !== 'stripe') return;

            transaction = {
                id:             transaction.id,
                status:         transaction.status,
                refund:         false,
                date:           transaction.date,
                amount:         Number(transaction.amount),
                gateway:        transaction.gateway,
                bookingId:      detail.bookingId,
                bookingCode:    detail.id,
                bookingStatus:  detail.statusId,
                bookingSummary: detail.summary,

                items: [...bookedItems],
                multipleItems: bookedItems.size > 1,

                categories: [...bookedCategories],
                multipleCategories: bookedCategories.size > 1
            };

            if(transaction.status){
                if(transaction.status.toLowerCase() === 'refund'){
                    transaction.refund = true;
                }
            }

            allTransactions.push(transaction);
        });
    });

    return allTransactions;
}

module.exports = {
    getAccount,
    getItems,
    getItem,
    getCategories,
    getEvents,
    getBookings,
    getBookingsWithDetails,
    getBooking,
    getItemsByCategory,
    getSettlementTransactions
}
