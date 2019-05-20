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

    bookings = bookings.map(booking => new Booking(booking));

    return res.json(bookings);
});

router.get('/bookings/:id', async (req, res, next) => {
    const bookingId = req.params.id;

    let detail = (await checkfrontClient.getBooking(bookingId)).booking;

    if(!detail) return res.status(404).json({ message: 'Not found' });

    return res.json(new BookingDetail(detail));
});

router.get('/settlement', async (req, res, next) => {

    const itemsAvailable      = await checkfrontClient.getItems(),
          categoriesAvailable = await checkfrontClient.getCategories();

    const categoryMap = categoriesAvailable.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
    }, {});

    let { month, year } = req.query;

    if(!(month && year)){
        const date = new Date();

        month = date.getMonth() + 1;
        year  = date.getFullYear();
    }

    let bookings = await checkfrontClient.getBookings(month, year);

    bookings = bookings.map(booking => new Booking(booking));

    const promises     = [],
          allTransactions = [];

    bookings.forEach(async booking => {
        promises.push(new Promise(async (resolve, reject) => {
            let detail = (await checkfrontClient.getBooking(booking.id)).booking;

            let transactions = Object.keys(detail.transactions).map(key => detail.transactions[key]),
                items        = Object.keys(detail.items).map(key => detail.items[key]);

            const bookedItems      = new Set(),
                  bookedCategories = new Set();

            transactions.forEach(transaction => {

                items.forEach(item => {
                    bookedItems.add(item.name);
                    bookedCategories.add(categoryMap[item.category_id]);
                });

                allTransactions.push({
                        id:             transaction.id,
                        status:         transaction.status,
                        date:           new Date(transaction.date * 1000),
                        amount:         Number(transaction.amount),
                        gateway:        transaction.gateway_id,
                        bookingId:      booking.id,
                        bookingCode:    booking.code,
                        bookingStatus:  booking.statusId,
                        bookingSummary: booking.summary,

                        items:         [...bookedItems],
                        multipleItems: bookedItems.size > 1,

                        categories:         [...bookedCategories],
                        multipleCategories: bookedCategories.size > 1
                });
            });

            resolve();
        }));
    });

    Promise.all(promises).then(() => {
        return res.json(allTransactions);
    }).catch(e => console.log(e));

});

router.get('/items', async (req, res, next) => {
    let items = await checkfrontClient.getItems();

    return res.json(items);
});

router.get('/items/:id', async (req, res, next) => {
    let item = await checkfrontClient.getItem(req.params.id);

    return res.json(item.item);
});

module.exports = router;
