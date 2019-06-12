'use strict';

const apiPrefix = process.env.VUE_APP_API_PREFIX;

const api = {
    async getBookings(month, year){
        let url = `${ apiPrefix }/bookings`;

        if(month && year) url += `?month=${ month }&year=${ year }`;

        let bookings = await fetch(url);
            bookings = await bookings.json();

        return bookings;
    },
    async getBookingDetail(id){
        const url = `${ apiPrefix }/bookings/${ id }`;

        let detail = await fetch(url);
            detail = await detail.json();

        return detail;
    },
    async getItems(){
        const url = `${ apiPrefix }/items`;

        let items = await fetch(url);
            items = await items.json();

        return items;
    },
    async getSettlement(month, year){
        let url = `${ apiPrefix }/stripe-transactions`;

        if(month && year) url += `?month=${ month }&year=${ year }`;

        let settlement = await fetch(url);
            settlement = await settlement.json();

        return settlement;
    }
}

export default api;
