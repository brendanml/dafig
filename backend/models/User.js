const mongoose = require('mongoose');
 
// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    // unique: true,
    // trim: true, // Removes extra whitespace
  },
  password: {
    type: String,
    // required: true,
    // minlength: 6, // Minimum password length
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;