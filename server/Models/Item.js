'use strict';

function Item(checkfrontItem){

    this.id   = checkfrontItem.item_id;
    this.name = checkfrontItem.name;
    this.sku  = checkfrontItem.sku;
    this.pos  = checkfrontItem.pos;
    this.url  = checkfrontItem.url;

    this.category             = checkfrontItem.category;
    this.categoryId           = checkfrontItem.category_id;
    this.categoryPos          = checkfrontItem.category_pos;
    this.productGroupType     = checkfrontItem.product_group_type;
    this.productGroupChildren = checkfrontItem.product_group_children;

    this.unit       = checkfrontItem.unit;
    this.visibility = checkfrontItem.visibility;
    this.lock       = checkfrontItem.lock;
    this.stock      = checkfrontItem.stock;
    this.unlimited  = checkfrontItem.unlimited;
    this.type       = checkfrontItem.type;
    this.rated      = checkfrontItem.rated;
    this.status     = checkfrontItem.status;
    this.len        = checkfrontItem.len;
    this.aliasId    = checkfrontItem.alias_id;

    this.video  = checkfrontItem.video;
    this.images = Object.keys(checkfrontItem.image)
        .map(key => {
            const img = checkfrontItem.image[key];

            return {
                title: img.title,
                src:   img.src,
                path:  img.path,
                url:   img.url,
                urlSm: img.url_small,
                urlMd: img.url_medium
            }
        });

    try{ this.meta = JSON.parse(checkfrontItem.meta) }
    catch{ this.meta = {} }
    
    try{ this.rules = JSON.parse(checkfrontItem.rules) }
    catch{ this.rules = {} }

    this.summary = checkfrontItem.summary;
    this.details = checkfrontItem.details;

    return this;
}

module.exports = Item;
