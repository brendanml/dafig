const mongoose = require('mongoose');
 
const listingSchema = new mongoose.Schema({
    _id: String,
    condition: {
        type: String,
        required: true,
    },
    fig_id: {
        type: String,
        ref: 'Minifig',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    store_id: {
        type: String,
        ref: 'Store',
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;