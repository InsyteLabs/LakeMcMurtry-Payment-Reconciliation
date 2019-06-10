'use strict';

const router = require('express').Router(),
      conf   = require('./conf'),
      stripe = require('stripe')(conf.stripe.apiKey);

const checkfrontClient = require('./Http/CheckfrontClient'),
      stripeClient     = require('./Http/StripeClient'),
      Booking          = require('./Models/Booking'),
      BookingDetail    = require('./Models/BookingDetail'),
      Item             = require('./Models/Item');

const getMonthStartEndTimestamps = require('./lib/get-month-start-end-timestamps');

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

router.get('/stripe-transactions', async (req, res, next) => {
    const { start, end  } = getMonthStartEndTimestamps(req.query);

    try{
        const charges = await stripeClient.getCharges(start, end),
              refunds = await stripeClient.getRefunds(start, end);

        const categories  = await checkfrontClient.getCategories(),
              categoryMap = categories.reduce((map, cat) => {
                  map[cat.id] = cat.name;
                  return map;
              }, {})

        const promises = [];

        const transactions = [...charges, ...refunds];

        transactions.forEach(transaction => {
            promises.push(new Promise(async (resolve, reject) => {
                const booking = await checkfrontClient.getBooking(transaction.bookingCode);

                if(!booking){
                    console.log(`Failed to fetch booking ${ transaction.bookingCode }`);
                }

                transaction.bookingId = booking.bookingId;

                const items      = new Set(),
                      categories = new Set();

                booking.items.forEach(item => {
                    items.add(item.name);
                    categories.add(categoryMap[item.categoryId]);
                });

                transaction.categories         = Array.from(categories);
                transaction.multipleCategories = transaction.categories.length > 1;
                transaction.items              = Array.from(items);
                transaction.multipleItems      = transaction.items.length > 1;

                resolve();
            }));
        });

        await Promise.all(promises);

        const data = {
            totalCharges: 0,
            totalChargedAmount: 0,
            totalFees: 0,
            totalRefunds: 0,
            totalRefundAmount: 0,
            gross: 0
        }

        transactions.forEach(transaction => {
            if(transaction.type === 'charge'){
                data.totalCharges++;
                data.totalChargedAmount += transaction.amount;
                data.totalFees          += transaction.fee;
                data.gross              += transaction.amount;
                return;
            }

            data.totalRefunds++;
            data.totalRefundAmount += transaction.amount;
            data.gross             -= transaction.amount;
        });

        data.net = data.gross - data.totalFees;

        data.totalChargedAmount = parseFloat(data.totalChargedAmount.toFixed(2));
        data.totalFees          = parseFloat(data.totalFees.toFixed(2));
        data.totalRefundAmount  = parseFloat(data.totalRefundAmount.toFixed(2));
        data.gross              = parseFloat(data.gross.toFixed(2));
        data.net                = parseFloat(data.net.toFixed(2));

        const byCategory = mapStripeTransactions(transactions);

        for(const category in byCategory){

            const group = byCategory[category];

            group.totalCharges       = 0;
            group.totalChargedAmount = 0;
            group.totalFees          = 0;
            group.totalRefunds       = 0;
            group.totalRefundAmount  = 0;
            group.gross              = 0;
            group.net                = 0;

            group.transactions.forEach(transaction => {
                if(transaction.type === 'charge'){
                    group.totalCharges++;
                    group.totalChargedAmount += transaction.amount;
                    group.totalFees          += transaction.fee;
                    group.gross              += transaction.amount;
                    return;
                }
                group.totalRefunds++;
                group.totalRefundAmount += transaction.amount;
                group.gross             -= transaction.amount;
            });

            group.net = group.gross - group.totalFees;

            group.totalChargedAmount = parseFloat(group.totalChargedAmount.toFixed(2));
            group.totalFees          = parseFloat(group.totalFees.toFixed(2));
            group.totalRefundAmount  = parseFloat(group.totalRefundAmount.toFixed(2));
            group.gross              = parseFloat(group.gross.toFixed(2));
            group.net                = parseFloat(group.net.toFixed(2));
        }

        data.transactions = byCategory;

        return res.json(data);
    }
    catch(e){
        return res.status(500).json({ error: e.message, stack: e.stack });
    }
});


function mapStripeTransactions(transactions){
    const categoryMap = {
        'East Tent Campsites': 'Tent Camping',
        'West Tent Campsites': 'Tent Camping',

        'Primitive Campsites': 'Primitive Camping',

        'East RV Campsites': 'RV Camping',
        'West RV Campsites': 'RV Camping',

        'Annual Membership': 'Annual Memberships',
        'Day Permit':        'Day Permits',

        'Pavilion Rental': 'Pavilion Rentals'
    }

    const transactionsByCategory = {
        'No Categories': {
            transactions: []
        },
        'Multiple Categories': {
            transactions: []
        }
    }

    for(let i = 0, len = transactions.length; i < len; i++){
        const transaction = transactions[i],
              category    = categoryMap[transaction.categories[0]];

        if(transaction.multipleCategories){
            transactionsByCategory['Multiple Categories'].transactions.push(transaction);
        }
        else if(transaction.categories.length === 0){
            transactionsByCategory['No Categories'].transactions.push(transaction);
        }
        else if(category in transactionsByCategory){
            transactionsByCategory[category].transactions.push(transaction);
        }
        else{
            transactionsByCategory[category] = { transactions: [ transaction ] }
        }
    }

    return transactionsByCategory;
}

module.exports = router;
