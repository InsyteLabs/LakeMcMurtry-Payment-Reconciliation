'use strict';

const client = require('./CheckfrontClient'),
      fs     = require('fs');

(async () => {

    let account  = await client.getAccount(),
        bookings = await client.getBookings(),
        items    = await client.getItems(),
        events   = await client.getEvents();

    bookings = Object.keys(bookings['booking/index'])
        .map(key => bookings['booking/index'][key])
        .map(async booking => {
            const detail = (await client.getBooking(booking.booking_id)).booking;

            detail.transactions = Object.keys(detail.transactions).map(key => detail.transactions[key]);
            detail.items        = Object.keys(detail.items).map(key => detail.items[key]);

            booking.detail = detail;

            return booking
        });

    await Promise.all(bookings);

    const resolved = [];

    for(let booking of bookings){
        booking = await booking;
        resolved.push(booking);
    }

    bookings = resolved.map(booking => {
        const detail       = booking.detail || {},
              transactions = detail.transactions || [];

        detail.meta  = detail.meta || {};
        detail.items = detail.items || [];

        return {
            id:            booking.booking_id,
            code:          booking.code,
            status:        booking.status_id,
            statusName:    booking.status_name,
            created:       new Date(Number(booking.created_date) * 1000),
            created_stamp: booking.created_date,
            total:         booking.total,
            tax:           booking.tax_total,
            paid:          booking.paid_total,
            customer: {
                id:    detail.customer_id,
                name:  booking.customer_name,
                email: booking.customer_email,
                phone: detail.meta.customer_phone,
                city:  detail.customer_city,
                state: detail.meta.state2,
                zip:   detail.customer_postal_zip
            },
            items: detail.items.map(item => {
                return {
                    status:     item.status_id,
                    id:         item.id,
                    name:       item.name,
                    quantity:   item.qty,
                    total:      item.total,
                    start:      new Date(Number(item.start_date) * 1000),
                    end:        new Date(Number(item.end_date) * 1000),
                    categoryId: item.category_id
                }
            }),
            transactions: detail.transactions.map(item => {
                return {
                    id:      item.id,
                    date:    new Date(Number(item.date) * 1000),
                    status:  item.status,
                    amount:  (Number(item.amount)).toFixed(2),
                    gateway: item.gateway_id
                }
            })
        }
    })

    fs.writeFileSync('./bookings-alt.json', JSON.stringify(bookings, null, 2), 'utf8');
    console.log('DONE');

})();