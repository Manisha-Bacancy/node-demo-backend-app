const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const saltRounds = 10;
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
    profileImage: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    isDefaultPassword: {
        type: Boolean,
        default: false
    },
});
// HASH THE PASSWORD BEFORE SAVING TO DB
userSchema.pre("save", function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // for new password
    if (user.password) {
        console.log("PASSWORD: ", user.password);
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
});

// COMPARE HASH
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user', userSchema);