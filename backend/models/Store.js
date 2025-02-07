const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    listings: [{
        type: String,
        ref: 'Listing',
    }],
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;