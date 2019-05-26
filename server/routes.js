'use strict';

const router = require('express').Router();

const checkfrontClient = require('./Http/CheckfrontClient'),
      Booking          = require('./Models/Booking'),
      BookingDetail    = require('./Models/BookingDetail'),
      Item             = require('./Models/Item');

router.get('/bookings', async (req, res, next) => {
    let { month, year } = req.query;

    if(!(month && year)){
        const date  = new Date();

        month = date.getMonth() + 1;
        year  = date.getFullYear();
    }

    let bookings = await checkfrontClient.getBookings(month, year);

    return res.json(bookings);
});

router.get('/bookings-with-details', async (req, res, next) => {
    let { month, year } = req.query;

    const details = await checkfrontClient.getBookingsWithDetails(month, year);

    return res.json(details);
})

router.get('/bookings/:id', async (req, res, next) => {
    const bookingId = req.params.id;

    let detail = await checkfrontClient.getBooking(bookingId);

    if(!detail) return res.status(404).json({ message: 'Not found' });

    return res.json(detail);
});

router.get('/settlement', async (req, res, next) => {

    const { month, year } = req.query;
    const settlement = await checkfrontClient.getSettlementTransactions(month, year);

    return res.json(settlement);
});

router.get('/items', async (req, res, next) => {
    let items = await checkfrontClient.getItems();

    return res.json(items);
});

router.get('/items/:id', async (req, res, next) => {
    let item = await checkfrontClient.getItem(req.params.id);

    return res.json(item.item);
});

router.get('/items-by-category', async (req, res, next) => {
    let items = await checkfrontClient.getItemsByCategory();

    return res.json(items);
});

router.get('/categories', async (req, res, next) => {
    let categories = await checkfrontClient.getCategories();

    return res.json(categories);
});

module.exports = router;
