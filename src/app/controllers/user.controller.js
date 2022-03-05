// MODELS
const { generateAuthToken } = require('../../utils/jwt.util');
const userModel = require('../models/user.model');
const { isValidObjectId } = require('mongoose');
const { validateEmail, validateFullName } = require('../../utils/common.util');


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


const userLogin = async (req, res, next) => {
    console.log("in login");
    let { email, password } = req.body;

    let userObj;
    try {
        // FIND USER AGAINST EMAIL
        userObj = await userModel.findOne({ email: email }).exec();
    }
    catch (err) {
        return next(err);
    }
    if (!userObj) {
        return res.status(400).json({
            error: true,
            message: `User doesn't exist.`,
            data: {}
        });
    }

    // CHECK IF USER EXISTS
    console.log("userObj::::", userObj)
    if (userObj) {
        //if (userObj.isDefaultPassword) {
        userObj.comparePassword(password, async (err, isMatch) => {
            try {
                if (err) throw err;
                if (isMatch) {
                    userObj.password = undefined;
                    console.log("USER OBJ: ", userObj);

                    let trimmedUser = {
                        _id: userObj._id,
                        name: userObj.name,
                        email: userObj.email,

                    };
                    //GENERATE AUTH TOKEN
                    let token = await generateAuthToken(
                        JSON.parse(JSON.stringify(trimmedUser)), false);
                    const obj = {
                        user: trimmedUser,
                        token: token
                    }


                    return res.status(200).json({
                        error: false,
                        message: `Login Successful.`,
                        data: obj,
                        isDefaultPassword: true
                    });
                }
                else {
                    let err = new Error('Please enter valid password.');
                    err.status = 400;
                    return next(err);
                }
            } catch (error) {
                return next(error);
            }
        });
        // }

    }
};
const uploadFile = async (file) => {
    return new Promise(async (resolve, reject) => {
        var obj = {
            name: req.body.name,
            desc: req.body.desc,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }
        // const s3 = new AWS.S3({
        //     accessKeyId: process.env.S3_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        // });
        // const bucket = process.env.S3_BUCKET_NAME + "/users";

        // const params = {
        //     Bucket: bucket,
        //     Key: file.filename,
        //     Body: fs.createReadStream("uploads/" + file.filename),
        //     ContentType: file.mimetype,
        //     ACL: 'public-read',
        // };
        // await s3.upload(params, function (err, data) {
        //     if (err) throw err
        //     resolve(data)
        // });
    })
};
const editProfile = async (req, res, next) => {
    console.log("VALIDATE req:", req);
    let { name, email, description } = req.body;
    // if (!validateEmail(email) || email.length === 0 || !email) {
    //     return res.status(400).json({
    //         error: true,
    //         message: `Please enter valid email address.`,
    //         data: {}
    //     });
    // }

    // console.log("VALIDATE FULL NAME:", validateFullName(name));
    // if (!validateFullName(name) || name.length === 0 || !name) {
    //     return res.status(400).json({
    //         error: true,
    //         message: `Name must be Alphabetic and space-delimited.`,
    //         data: {}
    //     });
    // }
    // return res.status(200).json({
    //     error: false,
    //     message: `Changes saved successfully.`,
    //     data: {
    //         user: "trimmedUser"
    //     },
    //     isVerified: true
    // });

    let userObj;
    // try {
    //     userObj = await userModel.findOne({ _id: "6222f39720f963d55e7aa533" }).exec();
    // }
    // catch (err) {
    //     return next(err);
    // }
    if (!userObj) {
        return res.status(400).json({
            error: true,
            message: `User doesn't exist.`,
            data: {}
        });
    } else {
        let userObjUpdated;
        let updateValue = {
            name: name,
            email: email,
            description: description
        }
        try {
            userObjUpdated = await userModel.findOneAndUpdate({ _id: "6222f39720f963d55e7aa533" },
                { $set: updateValue }, { new: true }).exec();
        }
        catch (err) {
            return next(err);
        }
        return res.status(200).json({
            error: false,
            message: `Changes saved successfully.`,
            data: {
                user: updateValue
            },
            isVerified: true
        });
    }
    // if (userObj) {
    //     // EMAIL NOT MODIFIED

    //     let userObjUpdated;
    //     try {
    //         let updateValue = {
    //             name: name,
    //             description: description,

    //         }

    //         if (req.file != null) {
    //             console.log("upload:::", req.file)
    //             // let uploadedFile = await uploadFile(req.file);
    //             // updateValue.profileImage = uploadedFile.Location;
    //             // fs.unlink("./uploads/" + req.file.filename, function (err) {
    //             //     if (err) {
    //             //         return res.status(400).json({
    //             //             error: true,
    //             //             message: `Error while uploading Profile Image.`,
    //             //             data: {}
    //             //         });
    //             //     }
    //             // });
    //         }

    //         userObjUpdated = await userModel.findOneAndUpdate({ _id: req.user._id },
    //             { $set: updateValue }, { new: true }).exec();
    //         console.log("userObjUpdated:::::", userObjUpdated);
    //     }
    //     catch (err) {
    //         return next(err);
    //     }
    //     if (userObjUpdated) {
    //         // userObjUpdated.password = undefined;
    //         let trimmedUser = {
    //             _id: userObjUpdated._id,
    //             name: userObjUpdated.name,
    //             email: userObjUpdated.email,
    //             profileImage: userObjUpdated.profileImage,
    //             description: userObjUpdated.description,

    //         };
    //         return res.status(200).json({
    //             error: false,
    //             message: `Changes saved successfully.`,
    //             data: {
    //                 user: trimmedUser
    //             },
    //             isVerified: true
    //         });
    //     }

    //}
};





module.exports = {
    userSignup, userLogin, editProfile
};