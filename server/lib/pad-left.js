'use strict';

function padLeft(str, len, pad){
    str = str.toString();

    while(str.length < pad) str = `${ pad }${ str }`;

    return str;
}

module.exports = padLeft;
