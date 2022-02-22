// MODELS
const { generateAuthToken } = require('../../utils/jwt.util');
const userModel = require('../models/user.model');
const { isValidObjectId } = require('mongoose');


const userSignup = async (req, res, next) => {
    let { name, email, password } = req.body;
    console.log("email::::::", typeof email);
    let user;
    try {
        try {
            user = await userModel.findOne({ email: email }).exec();
        }
        catch (err) {

            return next(err);
        }

        if (user) {
            return res.status(409).json({
                error: true,
                message: `This email address is already taken!`,
                data: {}
            });
        }

        let newUserObj = new userModel({
            name: name,
            email: email,
            password: password
        });

        let userSavedObj = await newUserObj.save();

        let trimmedUser = {
            _id: (userSavedObj._id).toString(),
            name: userSavedObj.name,
            email: userSavedObj.email,

        };
        //GENERATE AUTH TOKEN
        let token = await generateAuthToken(
            JSON.parse(JSON.stringify(trimmedUser)), false);
        const obj = {
            user: trimmedUser,
            token: token
        }

        console.log("trimmedUser:::", trimmedUser)
        console.log("userSavedObj:::", obj)
        return res.status(200).json({
            error: false,
            message: `Your Account has been created, please check your email.`,
            data: obj
        });
    } catch (e) {
        console.log("Error::::", e)
        // const { email } = JSON.parse(JSON.stringify(e));
        // const { message } = email
        return res.status(400).json({
            error: true,
            message: e,
            data: {}
        });
    }

};


module.exports = {
    userSignup,
};