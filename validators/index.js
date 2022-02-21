const { validationResult } = require('express-validator');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // return res.status(400).json({ errors: errors.array() });
  return res.status(400).json({
    error: true,
    message: errors.array()[0].msg,
    data: {}
  });
};

module.exports = {
  validate
};
