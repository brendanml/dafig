require('dotenv').config();
const OAuth = require('oauth');

// Access environment variables
const CONS_KEY = process.env.VITE_CON_KEY;
const CONS_SEC = process.env.VITE_CON_SEC;
const ACCESS_TOKEN = process.env.VITE_ACC_TOK;
const ACCESS_SECRET = process.env.VITE_ACC_SEC;

// Initialize OAuth
let oauth = new OAuth.OAuth('', '', CONS_KEY, CONS_SEC, '1.0', null, 'HMAC-SHA1');

// Define fields (optional, as per your use case)
const fields = [{
    label: 'Item Name',
    value: 'item.name'
}, {
    label: 'Colour',
    value: 'color_name'
}];

// Use the API
oauth.get(
    'https://api.bricklink.com/api/store/v1/inventories',
    ACCESS_TOKEN,
    ACCESS_SECRET,
    function (error, data, res) {
        if (error) {
            console.error(error);
            return;
        }
        // Parse and log the response data
        const obj = JSON.parse(data);
        console.log(obj);
    }
);
