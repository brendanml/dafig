const mongoose = require('mongoose');

const minifigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Minifig', minifigSchema);