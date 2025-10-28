const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

const validate = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          new ApiError(400, 'Validation failed', true, errors.array()),
        );
      }
      return next();
    },
  ];
};

module.exports = validate;
