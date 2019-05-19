'use strict';

const padLeft = require('../lib/pad-left');

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

    const dateParts = this.dateDesc.split(' - ');
    this.startDate  = _formatDate(dateParts[0]);
    this.endDate    = _formatDate(dateParts[1]);

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

function _formatDate(str){
    if(!str) return '';

    const date  = new Date(str),
          year  = date.getFullYear(),
          month = padLeft(date.getMonth() + 1, 2, '0'),
          day   = padLeft(date.getDate(), 2, '0');

    return `${ month }/${ day }/${ year }`;
}

module.exports = Booking;
