



const OAuth = require('oauth');
// const { Parser } = require('json2csv');
// const fs = require('fs');


let CONS_KEY = "B5A9200A93B8483CBC9F6C8BE9728864"

let CONS_SEC = "ACB3D77B94BF49E88809F9346E1D340D"

let ACCESS_TOKEN = "3411AA475E3E4047BDA20CDC4486B54E"

let ACCESS_SECRET = "25D172F22CD64D4F98F34F146C46B214"

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