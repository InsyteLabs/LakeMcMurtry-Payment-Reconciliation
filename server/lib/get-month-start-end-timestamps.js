'use strict';

module.exports = function getMonthStartEndTimestamps(obj){
    let { month, year } = obj;

    if(!(month && year)){
        let date = new Date();

        month = date.getMonth() + 1;
        year  = date.getFullYear();
    }

    let date  = new Date(year, month - 1, 1),
        start = new Date(date.getFullYear(), date.getMonth(), 1),
        end   = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    start = Math.floor(start.getTime() / 1000);

    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(999);
    end = Math.floor(end.getTime() / 1000);

    return { start, end }
}
