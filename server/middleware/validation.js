const { ApiError } = require('../utils/ApiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new ApiError(400, errorMessage);
    }
    
    next();
  };
};

module.exports = { validate };