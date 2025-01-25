const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI
const mongoURI = process.env.MONGODB_URI // Replace with your URI
console.log(process.env.MONGODB_URI)

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


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

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;