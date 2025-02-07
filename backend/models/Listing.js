const mongoose = require('mongoose');
 
const listingSchema = new mongoose.Schema({
    _id: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    store_id: {
        type: String,
        ref: 'Store',
        required: true,
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;