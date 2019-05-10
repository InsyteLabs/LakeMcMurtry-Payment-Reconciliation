'use strict';

const axios = require('axios'),
      conf  = require('../conf').checkfront;

axios.defaults.headers.common['Authorization'] = `Basic ${ conf.token }`;

module.exports = {
    async getAccount(){
        try{
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/account`,
                responseType: 'json'
            });

            return res.data
        }
        catch(e){ throw e }
    },
    async getItems(){
        try{
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/item`,
                responseType: 'json'
            });

            return res.data;
        }
        catch(e){ throw e }
    },
    async getItem(id){
        try{
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/item/${ id }`,
                responseType: 'json'
            });

            return res.data;
        }
        catch(e){ throw e }
    },
    async getEvents(){
        try{
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/item`,
                responseType: 'json'
            });

            return res.data;
        }
        catch(e){ throw e }
    },
    async getBookings(){
        try {
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/booking?created_date=${ '>1553144400' }`,
                responseType: 'json'
            });

            return res.data;
        }
        catch(e){ throw e }
    },
    async getBooking(id){
        try{
            const res = await axios({
                method: 'get',
                url: `${ conf.endpoint }/booking/${ id }`,
                responseType: 'json'
            });

            return res.data;
        }
        catch(e){ throw e }
    }
}
