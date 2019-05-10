'use strict';

const router = require('express').Router();

const checkfrontClient = require('./Http/CheckfrontClient'),
      Booking          = require('./Models/Booking'),
      BookingDetail    = require('./Models/BookingDetail'),
      Item             = require('./Models/Item');

router.get('/bookings', async (req, res, next) => {
    let bookings = await checkfrontClient.getBookings();

    bookings = Object.keys(bookings['booking/index'])
        .map(key => bookings['booking/index'][key])
        .map(booking => new Booking(booking));

    return res.json(bookings);
});

router.get('/bookings/:id', async (req, res, next) => {
    const bookingId = req.params.id;

    let detail = (await checkfrontClient.getBooking(bookingId)).booking;

    if(!detail) return res.status(404).json({ message: 'Not found' });

    return res.json(new BookingDetail(detail));
});

router.get('/items', async (req, res, next) => {
    let items = (await checkfrontClient.getItems()).items;

    items = Object.keys(items)
        .map(key => new Item(items[key]))
        .sort((a, b) => {
            if(a.category === b.category) return 0;
            return a.category > b.category ? 1 : -1;
        });

    return res.json(items);
});

module.exports = router;
