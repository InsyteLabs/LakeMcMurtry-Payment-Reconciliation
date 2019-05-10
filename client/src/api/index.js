'use strict';

const apiPrefix = 'http://localhost:8000';

const api = {
    async getBookings(){
        const url = `${ apiPrefix }/bookings`;

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
    }
}

export default api;
