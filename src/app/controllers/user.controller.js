// MODELS
const userModel = require('../models/user.model');


const userSignup = async (req, res, next) => {
    let { name, email, password } = req.body;

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
        console.log("userSavedObj:::", userSavedObj)
        return res.status(200).json({
            error: false,
            message: `Your Account has been created, please check your email.`,
            data: {}
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