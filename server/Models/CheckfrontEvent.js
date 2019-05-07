'use strict';

function CheckfrontEvent(csvRow){
    this.id      = csvRow.ID;
    this.event   = csvRow.Event;
    this.class   = csvRow.Class;
    this.source  = csvRow.Source;
    this.message = csvRow.Message;
    this.date    = csvRow.Date;

    const date      = new Date(this.date);
    this.dateString = date.toString();
    this.timestamp  = date.getTime();

    return this;
}

module.exports = CheckfrontEvent;
