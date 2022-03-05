//const express = require('express')
// const User = require('../models/user.model');
// const router = new express.Router();
const { validate } = require('../../../validators');
const userValidator = require('../../../validators/user.validator');
const { validateAuthToken } = require('../../utils/jwt.util');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `uploads/`
        fs.mkdirSync(path, { recursive: true })
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}${path.extname(file.originalname)}`);
    },
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (file.size > 2097152) {
            return callback(new Error('Uploading file greater than 2MB is not allowed.'));
        }
        if (ext === '.PNG' || ext === '.png' || ext === '.JPG' || ext === '.JPEG' || ext === '.jpg' || ext === '.jpeg') {
            callback(null, true);
        }
        else {
            return callback(new Error('Only images are allowed'));
        }
    },
    // limits: { fileSize: 2000000 } // file size limit for 2 mb
});

module.exports = app => {
    const { userSignup, userLogin, editProfile } = require('../controllers/user.controller');

    app.post('/users/signup',
        validate(userValidator.userSignup),
        userSignup);

    app.post('/users/login',
        validate(userValidator.userLogin),
        userLogin);

    // app.put('/users/editProfile',
    //     //validateAuthToken,
    //     //upload.single('profileImage'),
    //     editProfile);

    app.put('/users/editProfile',
        validateAuthToken,
        editProfile);
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