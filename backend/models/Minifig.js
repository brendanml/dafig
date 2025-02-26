const mongoose = require('mongoose');

const minifigSchema = new mongoose.Schema({
    _id: {
        type: String, // Custom string ID like "sw0005"
        required: true
    },
    image: {
        type: String,
        required: true
    },
    listings: {
        type: [String], // Store multiple listing IDs as an array
        required: true
    },
    name: {
        type: String, // Add 'name' field since it's in your data
        required: true
    }
});

module.exports = mongoose.model('Minifig', minifigSchema);
