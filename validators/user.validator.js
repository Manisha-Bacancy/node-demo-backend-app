const { query, param, body } = require('express-validator');

module.exports.userSignup = [
    body('name')
        .isString()
        .withMessage('Name must be a string.'),
    //.matches(/^[a-zA-z]+([ '’][a-zA-Z]+)*$/)
    //.withMessage('Name must be Alphabetic and space-delimited.'),

    body('email')
        .isString()
        .withMessage('Email must be a string.')
        .isEmail()
        .withMessage('Email must be a valid email address.'),

    body('password')
        .isString()
        .withMessage('Password must be a string.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),
];

