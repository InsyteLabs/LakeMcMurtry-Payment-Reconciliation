'use strict';

export function padLeft(str, len, pad){
    str = String(str);

    while(str.length < len) str = `${ pad }${ str }`;

    return str;
}
