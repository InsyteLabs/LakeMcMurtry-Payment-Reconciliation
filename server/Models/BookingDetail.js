'use strict';

const padLeft = require('../lib/pad-left');

function BookingDetail(checkFrontDetail){

    this.id        = checkFrontDetail.id;
    this.tid       = checkFrontDetail.tid;
    this.token     = checkFrontDetail.token;
    this.bookingId = checkFrontDetail.booking_id;
    this.accountId = checkFrontDetail.account_id;
    this.statusId  = checkFrontDetail.status_id;

    this.created   = new Date(checkFrontDetail.created_date * 1000);
    this.startDate = dateStringFromTime(checkFrontDetail.start_date * 1000);
    // End date always seems to be set to 12:00AM the following, subtract 1 to make them match
    // this.endDate   = dateStringFromTime(checkFrontDetail.end_date * 1000 - 1);
    this.endDate   = dateStringFromTime(checkFrontDetail.end_date * 1000);
    this.checkin   = checkFrontDetail.checkin;
    this.checkout  = checkFrontDetail.checkout;

    const meta = checkFrontDetail.meta || {};

    this.customer = {
        id:      checkFrontDetail.customer_id,
        name:    checkFrontDetail.customer_name       || meta.customer_name,
        email:   checkFrontDetail.customer_email      || meta.customer_email,
        phone:   checkFrontDetail.customer_phone      || meta.customer_phone,
        address: checkFrontDetail.customer_address    || meta.customer_address,
        city:    checkFrontDetail.customer_city       || meta.customer_city,
        state:   meta.state2,
        region:  checkFrontDetail.customer_region,
        zip:     checkFrontDetail.customer_postal_zip || meta.customer_postal_zip,
        country: checkFrontDetail.customer_country
    }

    this.partner  = checkFrontDetail.partner_id;
    this.provider = checkFrontDetail.provider;

    this.currency    = checkFrontDetail.currency_id;
    this.depositDue  = Number(checkFrontDetail.deposit_due);
    this.amountPaid  = Number(checkFrontDetail.amount_paid);
    this.amountDue   = Number(checkFrontDetail.amount_due);
    this.taxTotal    = Number(checkFrontDetail.tax_total);
    this.taxIncTotal = Number(checkFrontDetail.tax_inc_total);
    this.subTotal    = Number(checkFrontDetail.sub_total);
    this.total       = Number(checkFrontDetail.total);

    this.items        = checkFrontDetail.items        || {};
    this.transactions = checkFrontDetail.transactions || {};

    this.items = Object.keys(this.items)
        .map(key => new BookingItem(this.items[key]));
    this.transactions = Object.keys(this.transactions)
        .map(key => new BookingTransaction(this.transactions[key]));

    return this;
}

function BookingItem(item){
    this.id         = item.id;
    this.categoryId = item.category_id;
    this.statusId   = item.status_id;
    this.name       = item.name;
    this.sku        = item.sku;

    this.event     = item.event;
    this.startDate = dateStringFromTime(item.start_date * 1000);
    this.endDate   = dateStringFromTime(item.end_date * 1000);

    this.param       = item.param;
    this.qty         = item.qty;
    this.discount    = item.discount;
    this.itemTotal   = item.item_total;
    this.subTotal    = item.sub_total;
    this.taxIncTotal = item.tax_inc_total;
    this.taxTotal    = item.tax_total;
    this.total       = item.total;

    this.unit    = item.unit;
    this.summary = item.summary;

    return this;
}

function BookingTransaction(transaction){
    this.id      = transaction.id;
    this.date    = dateStringFromTime(transaction.date * 1000);
    this.status  = transaction.status;
    this.amount  = Number(transaction.amount);
    this.gateway = transaction.gateway_id;

    return this;
}

function dateStringFromTime(time){
    const date = new Date(time),
          year = date.getFullYear(),
          month = padLeft(date.getMonth() + 1, 2, '0'),
          day   = padLeft(date.getDate(), 2, '0');

    return `${ month }/${ day }/${ year }`;
}

module.exports = BookingDetail;
