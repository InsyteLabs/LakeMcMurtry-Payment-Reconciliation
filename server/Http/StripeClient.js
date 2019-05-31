'use strict';

const conf   = require('../conf'),
      stripe = require('stripe')(conf.stripe.apiKey);

const { StripeCharge, StripeRefund } = require('../Models');

async function getCharges(start, end, after, charges=[]){

    const result = await _getChargesFromStripe(start, end, after);

    const newCharges = result.data
        .filter(charge => charge.status !== 'failed')
        .map(charge => new StripeCharge(charge));

    charges = [...charges, ...newCharges];

    if(result.has_more){
        const lastItem = charges[charges.length - 1];

        return await getCharges(start, end, lastItem.id, charges);
    }

    return charges;
}

async function getRefunds(start, end, after, refunds=[]){

    const result = await _getRefundsFromStripe(start, end, after);

    const newRefunds = result.data
        .filter(refund => refund.status !== 'failed')
        .map(refund => new StripeRefund(refund));

    refunds = [...refunds, ...newRefunds];

    if(result.has_more){
        const lastItem = refunds[refunds.length - 1];

        return await getRefunds(start, end, lastItem.id, refunds);
    }

    return refunds;
}

function _getChargesFromStripe(start, end, after){
    return new Promise((resolve, reject) => {

        const opt = {
            created: {
                gte: start,
                lte: end
            },
            limit: 100,
            expand: [ 'data.balance_transaction' ]
        }

        after && (opt.starting_after = after);

        stripe.charges.list(opt, (err, charges) => {
            if(err) return reject(err);

            resolve(charges);
        });
    });
}

function _getRefundsFromStripe(start, end, after){
    return new Promise((resolve, reject) => {

        const opt = {
            created: {
                gte: start,
                lte: end
            },
            limit: 100,
            expand: [ 'data.balance_transaction', 'data.charge' ]
        }

        after && (opt.starting_after = after);

        stripe.refunds.list(opt, (err, refunds) => {
            if(err) return reject(err);

            resolve(refunds);
        });
    });
}

module.exports = {
    getCharges,
    getRefunds
}
