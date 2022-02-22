//const express = require('express')
// const User = require('../models/user.model');
// const router = new express.Router();
const { validate } = require('../../../validators');
const userValidator = require('../../../validators/user.validator');


module.exports = app => {
    const { userSignup, } = require('../controllers/user.controller');

    app.post('/users/signup',
        validate(userValidator.userSignup),
        userSignup);
}



    // signup api
    // router.post('/users/signup', async (req, res, next) => {

    //     let { name, email, password } = req.body;
    //     console.log("email:::::::", email);
    //     let user;
    //     try {

    //         try {
    //             user = await User.findOne({ email: email }).exec();
    //         }
    //         catch (err) {
    //             return next(err);
    //         }
    //         if (user) {
    //             return res.status(409).json({
    //                 error: true,
    //                 message: `This email address is already taken!`,
    //                 data: {}
    //             });
    //         }
    //         let newUserObj = new User({
    //             name: name,
    //             email: email,
    //             password: password
    //         });

    //         let userSavedObj = await newUserObj.save();
    //         console.log("userSavedObj:::", userSavedObj)
    //         res.status(200).json({
    //             error: false,
    //             message: `Your Account has been created, please check your email.`,
    //             data: {}
    //         });
    //         // await user.save()
    //         // res.status(201).json({
    //         //     error: false,
    //         //     message: `Your Account has been created, please check your email.`,
    //         //     data: user
    //         // });

    //         // res.status(201).send(user)
    //     } catch (e) {
    //         console.log("Error::::", e)
    //         // const { email } = JSON.parse(JSON.stringify(e));
    //         // const { message } = email
    //         res.status(400).json({
    //             error: true,
    //             message: e,
    //             data: {}
    //         });

    //         // res.status(400).send(e)
    //     }
    // })

    //module.exports = router;