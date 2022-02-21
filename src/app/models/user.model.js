const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const validator = require('validator')

const userSchema = new Schema({
    name: {
        type: String,
        // required: true,
        // trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        default: ''
    },

})

module.exports = mongoose.model('user', userSchema);