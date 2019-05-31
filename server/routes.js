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

router.get('/settlement', async (req, res, next) => {

    const { month, year } = req.query;
    const settlement = await checkfrontClient.getSettlementTransactions(month, year);

    return res.json(settlement);
});

router.get('/settlement-alt', async (req, res, next) => {
    const { month, year } = req.query;
    const settlement = await checkfrontClient.getSettlementTransactions(month, year);

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

    const noCategories       = { category: 'No Categories',       transactions: [] },
          multipleCategories = { category: 'Multiple Categories', transactions: [] };

    const transactionsByCategory = [ noCategories, multipleCategories ];

    const data = {
        total: 0,
        transactionCount: 0,
        transactionsByCategory: {
            'No Categories': {
                total:            0,
                transactionCount: 0,
                transactions:     []
            },
            'Multiple Categories': {
                total:            0,
                transactionCount: 0,
                transactions:     []
            }
        }
    }

    settlement.forEach(transaction => {

        data.transactionCount++;
        if(transaction.refund){
            data.total -= transaction.amount;
        }
        else{
            data.total += transaction.amount;
        }

        const transactionCategory = transaction.categories[0];
        let transactionGroup;
        if(transaction.multipleCategories){
            transactionGroup = data.transactionsByCategory['Multiple Categories'];
        }
        else if(!transaction.categories.length){
            transactionGroup = data.transactionsByCategory['No Categories'];
        }
        else if(data.transactionsByCategory[transactionCategory]){
            transactionGroup = data.transactionsByCategory[transactionCategory];
        }
        else{
            transactionGroup = data.transactionsByCategory[transactionCategory] = {
                total: 0,
                transactionCount: 0,
                transactions: []
            }
        }

        transactionGroup.transactionCount++;
        if(transaction.refund){
            transactionGroup.total -= transaction.amount;
        }
        else{
            transactionGroup.total += transaction.amount;
        }
        transactionGroup.transactions.push(transaction);
    });

    return res.json(data);
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

        const data = {
            totalCharges: 0,
            totalChargedAmount: 0,
            totalFees: 0,
            totalRefunds: 0,
            totalRefundAmount: 0,
            gross: 0,
            charges,
            refunds
        }

        charges.forEach(charge => {
            data.totalCharges++;
            data.totalChargedAmount += charge.amount;
            data.totalFees          += charge.fee;
            data.gross              += charge.amount;
        });

        refunds.forEach(refund => {
            data.totalRefunds++;
            data.totalRefundAmount += refund.amount;
            data.gross             -= refund.amount;
        });

        data.net = data.gross - data.totalFees;

        data.totalChargedAmount = parseFloat(data.totalChargedAmount.toFixed(2));
        data.totalFees          = parseFloat(data.totalFees.toFixed(2));
        data.totalRefundAmount  = parseFloat(data.totalRefundAmount.toFixed(2));
        data.gross              = parseFloat(data.gross.toFixed(2));
        data.net                = parseFloat(data.net.toFixed(2));

        return res.json(data);
    }
    catch(e){
        return res.json(e);
    }
});

module.exports = router;
