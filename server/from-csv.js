'use strict';

const fs    = require('fs'),
      path  = require('path'),
      parse = require('csv-parse');

const CheckfrontEvent = require('./Models/CheckfrontEvent');

const stripeFile     = fs.readFileSync(path.resolve(__dirname, 'data', '2019-stripe.csv'),     'utf8'),
      checkfrontFile = fs.readFileSync(path.resolve(__dirname, 'data', '2019-checkfront.csv'), 'utf8');

(async () => {

    let stripeData, checkfrontData;
    try{
        stripeData = await parseFile(stripeFile, { columns: true });
        checkfrontData = await parseFile(checkfrontFile, { columns: true });

        // Filter out events of types we aren't interested in
        checkfrontData = checkfrontData
            .map(row => new CheckfrontEvent(row))
            .filter(item => {
                return !~[ 'login', 'setup', 'support', 'xls' ].indexOf(item.event.toLowerCase());
            });

        // Group the checkfront data by event ID
        checkfrontData = groupByKey(checkfrontData, 'id');

        console.log(JSON.stringify(checkfrontData, null, 2));
    }
    catch(e){
        console.log(e);
    }
})();

function parseFile(data, opt){
    const output = [];

    return new Promise((resolve, reject) => {
        parse(data, opt)
            .on('readable', function(){
                let record;
                while(record = this.read()) output.push(record);
            })
            .on('end', () => resolve(output));
    });
}

function groupByKey(arr, key){
    let grouped = {};

    arr.forEach(row => {
        if(grouped[row[key]]){
            grouped[row[key]].events.push(row);
        }
        else{
            grouped[row[key]] = {
                events: [ row ]
            };
        }
    });

    return grouped;
}