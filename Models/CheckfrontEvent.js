'use strict';

function CheckfrontEvent(csvRow){
    this.id      = csvRow.ID;
    this.event   = csvRow.Event;
    this.class   = csvRow.Class;
    this.source  = csvRow.Source;
    this.message = csvRow.Message;

    const date = new Date(csvRow.Date);

    this.dateString = date.toString();
    this.timestamp  = date.getTime();
    this.date       = csvRow.Date;

    return this;
}

module.exports = CheckfrontEvent;