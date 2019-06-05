'use strict';

function StripeCharge(charge){
    try{
        this.id          = charge.id;
        this.type        = 'charge';
        this.bookingCode = charge.balance_transaction.description.replace(/-\d+$/, '');
        this.status      = charge.status;
        this.paid        = charge.paid;

        this.amount         = parseFloat((charge.amount / 100).toFixed(2));
        this.fee            = parseFloat((charge.balance_transaction.fee / 100).toFixed(2));
        this.net            = parseFloat((charge.balance_transaction.net / 100).toFixed(2));
        this.refunded       = charge.refunded;
        this.amountRefunded = parseFloat((charge.amount_refunded / 100).toFixed(2));
        this.currency       = charge.currency;

        this.cardHolderName = charge.card.name;

        this.transactionDate = new Date(charge.created * 1000);

        this.receiptURL = charge.receipt_url;

        return this;
    }
    catch(e){
        console.log('FUCKING ERROR');
        console.log(e.message);
        console.log(charge);
        console.log('----------------');
    }
}

module.exports = StripeCharge;
