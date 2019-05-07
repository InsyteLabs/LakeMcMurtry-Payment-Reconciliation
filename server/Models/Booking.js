'use strict';

function Booking(checkFrontBooking){
    this.id       = checkFrontBooking.booking_id;
    this.tid      = checkFrontBooking.tid;
    this.token    = checkFrontBooking.token;
    this.code     = checkFrontBooking.code;
    this.statusId = checkFrontBooking.status_id;
    this.status   = checkFrontBooking.status_name;
    this.summary  = checkFrontBooking.summary;
    this.created  = new Date(checkFrontBooking.created_date * 1000);
    // Start - End date of booking
    this.dateDesc = checkFrontBooking.date_desc;

    this.total     = Number(checkFrontBooking.total);
    this.taxTotal  = Number(checkFrontBooking.tax_total);
    this.paidTotal = Number(checkFrontBooking.paid_total);

    this.customer = {
        id:    checkFrontBooking.customer_id,
        name:  checkFrontBooking.customer_name,
        email: checkFrontBooking.customer_email
    }

    return this;
}

module.exports = Booking;