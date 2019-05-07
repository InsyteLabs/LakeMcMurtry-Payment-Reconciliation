'use strict';

const router = require('express').Router();

const checkfrontClient = require('./Http/CheckfrontClient'),
      Booking          = require('./Models/Booking'),
      BookingDetail    = require('./Models/BookingDetail');

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

module.exports = router;