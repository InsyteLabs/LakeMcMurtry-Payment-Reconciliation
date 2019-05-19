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

    bookings = bookings.map(booking => new Booking(booking)).slice(0, 4)

    const promises = [];

    bookings.forEach(async booking => {
        promises.push(new Promise(async (resolve, reject) => {
            let detail = (await checkfrontClient.getBooking(booking.id)).booking;

            let transactions = Object.keys(detail.transactions).map(key => detail.transactions[key]),
                items        = Object.keys(detail.items).map(key => detail.items[key]);

            booking.items = items.map(item => {
                return {
                    id:         item.id,
                    categoryId: item.category_id,
                    category:   categoryMap[item.category_id],
                    name:       item.name,
                    status:     item.status_id,
                    start:      new Date(item.start_date * 1000),
                    end:        new Date(item.end_date   * 1000),
                    quantity:   Number(item.qty),
                    itemTotal:  Number(item.item_total),
                    subTotal:   Number(item.sub_total),
                    total:      Number(item.total)
                }
            });

            booking.transactions = transactions

            resolve();
        }));
    });

    Promise.all(promises).then(() => {
        console.log('DONE');
        return res.json(bookings);
    }).catch(e => console.log(e));

});

router.get('/items', async (req, res, next) => {
    let items = (await checkfrontClient.getItems()).items;

    return res.json(items);
});

router.get('/items/:id', async (req, res, next) => {
    let item = await checkfrontClient.getItem(req.params.id);

    return res.json(item.item);
});

module.exports = router;
