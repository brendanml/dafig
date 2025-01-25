



const OAuth = require('oauth');
// const { Parser } = require('json2csv');
// const fs = require('fs');

var oauth = new OAuth.OAuth('', '', CONS_KEY, CONS_SEC, '1.0', null, 'HMAC-SHA1');
const fields = [{
    label: 'Item Name',
    value: 'item.name'
}, {
    label: 'Colour',
    value: 'color_name'
}]

oauth.get('https://api.bricklink.com/api/store/v1/inventories', ACCESS_TOKEN, ACCESS_SECRET, function(error, data, res) {
    if (error) console.error(error);

    var obj = JSON.parse(data);

    console.log(obj)
});