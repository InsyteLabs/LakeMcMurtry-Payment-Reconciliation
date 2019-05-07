'use strict';

function BookingDetail(checkFrontDetail){

    this.id        = checkFrontDetail.id;
    this.tid       = checkFrontDetail.tid;
    this.token     = checkFrontDetail.token;
    this.bookingId = checkFrontDetail.booking_id;
    this.accountId = checkFrontDetail.account_id;
    this.statusId  = checkFrontDetail.status_id;

    this.created   = new Date(checkFrontDetail.created_date * 1000);
    this.startDate = new Date(checkFrontDetail.start_date * 1000);
    this.endDate   = new Date(checkFrontDetail.end_date * 1000);
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

    this.items = Object.keys(this.items).map(key => this.items[key]);
    this.transactions = Object.keys(this.transactions).map(key => this.transactions[key]);

    return this;
}

module.exports = BookingDetail;