'use strict';

export function currency(num){
    num = Number(num);

    if(isNaN(num)){
        return 'N/A';
    }

    return `$${ num.toFixed(2) }`;
}
