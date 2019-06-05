'use strict';

function StripeRefund(refund){
    this.id          = refund.id;
    this.type        = 'refund';
    this.bookingCode = refund.charge.description.replace(/-\d+$/, '');
    this.status      = refund.status;

    this.amount = parseFloat((refund.amount / 100).toFixed(2));

    this.cardHolderName = refund.charge.card.name;

    this.transactionDate = new Date(refund.created * 1000);
}

module.exports = StripeRefund;
