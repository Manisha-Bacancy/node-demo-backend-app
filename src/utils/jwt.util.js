const jwt = require('jsonwebtoken');
const userModel = require('../app/models/user.model');

// GENERATES AUTH AND RESET PASSWORD TOKEN
module.exports.generateAuthToken = async (payload, isAuthToken = true) => {
  let signOptions, cipherKey;
  // if (isAuthToken) {
  //   cipherKey = process.env.CIPHER_KEY;
  //   signOptions = {
  //     expiresIn: process.env.TOKEN_EXPIRATION || "365d"
  //   };
  // }
  // else {
  //   cipherKey = process.env.RESET_PASSWORD_CIPHER_KEY;
  //   signOptions = {
  //     expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRATION || "3m"
  //   };
  // }
  let token = await jwt.sign(payload, "thisismynewcourse");
  //let token = await jwt.sign(payload, cipherKey, signOptions);
  return token;
};

module.exports.validateAuthToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization != '') {
    jwt.verify(authorization, 'thisismynewcourse', async (err, verified) => {
      //jwt.verify(authorization, process.env.CIPHER_KEY, async (err, verified) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: `You are not authenticated!`,
          data: {},
        });
      }
      else {
        // req.user = verified;
        let userObj = await userModel.findOne({ _id: verified._id }).exec();

        // CHECK IF THE USER EXISTS OR NOT
        if (!userObj) {
          return res.status(400).json({
            error: true,
            message: `User doesn't exist.`,
            data: {}
          });
        }

        // CHECK IF THE USER IS VERIFIED OR NOT
        // if (userObj && !userObj.isVerified) {
        //   return res.status(403).json({
        //     error: true,
        //     message: `Your email is not verified, Please login to the App in order to verify your account.`,
        //     isVerified: false,
        //     data: {},
        //   });
        // }

        // CHECK IF THE USER IS ARCHIVED OR NOT
        // if (userObj && userObj.isArchived && userObj.isAdmin) {
        //   return res.status(400).json({
        //     error: true,
        //     message: `Your account is deactivated, kindly contact Super Admin.`,
        //     data: {},
        //     isArchived: true,
        //     isAdmin: true
        //   });
        // }
        // else if (userObj && userObj.isArchived && !userObj.isAdmin) {
        //   let message;
        //   if (userObj.isArchivedOrUnarchivedByAdmin) {
        //     message = `Your account is deactivated, kindly contact Super Admin.`;
        //   }
        //   else {
        //     message = `Your account is deactivated, kindly login to the App to continue.`;
        //   }
        //   return res.status(400).json({
        //     error: true,
        //     message: message,
        //     data: {},
        //     isArchived: true,
        //     isAdmin: false
        //   });
        // }
        // else {
        //   req.user = userObj;
        //   next();
        // }
      }
    });
  }
  else {
    return res.status(400).json({
      error: true,
      message: `Authorization token must be required!`,
      data: {}
    });
  }
};

module.exports.validateResetPasswordToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization != '') {
    jwt.verify(authorization, process.env.RESET_PASSWORD_CIPHER_KEY, (err, verified) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: `You have exceeded the allowed time to reset Password, please try again...`,
          data: {},
          isTokenExpired: true
        });
      }
      else {
        req.user = verified;
        next();
      }
    });
  }
  else {
    return res.status(400).json({
      error: true,
      message: `Authorization token must be required!`,
      data: {}
    });
  }
};