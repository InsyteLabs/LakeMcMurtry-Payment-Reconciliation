'use strict';

import { padLeft } from './pad-left';

export function formatDate(str){
    let date = new Date(str),
        year = date.getFullYear(),
        month = padLeft(date.getMonth() + 1, 2, '0'),
        day   = padLeft(date.getDate(), 2, '0'),
        hour  = date.getHours(),
        min   = padLeft(date.getMinutes(), 2, '0');

    let amPm;
    if(hour == 0){
        amPm = 'AM';
        hour = 12;
    }
    else if(hour > 12){
        amPm = 'PM';
        hour -= 12;
    }
    else if(hour == 12){
        amPm = 'PM';
    }
    else{ amPm = 'AM' }

    return `${ month }/${ day }/${ year } ${ hour }:${ min } ${ amPm }`;
}
