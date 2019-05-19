'use strict';

const router = require('express').Router();

const checkfrontClient = require('./Http/CheckfrontClient'),
      Booking          = require('./Models/Booking'),
      BookingDetail    = require('./Models/BookingDetail'),
      Item             = require('./Models/Item');

router.get('/bookings', async (req, res, next) => {
    let { month, year } = req.query;

    if(!(month && year)){
        const date  = new Date(),
              month = date.getMonth() + 1,
              year  = date.getFullYear();
    }

    let bookings = await checkfrontClient.getBookings(month, year);

    bookings = bookings.map(booking => new Booking(booking));

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

    return res.json(items);
});

router.get('/items/:id', async (req, res, next) => {
    let item = await checkfrontClient.getItem(req.params.id);

    return res.json(item.item);
});

module.exports = router;
