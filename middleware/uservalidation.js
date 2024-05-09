const Joi = require('joi');

const validateUserRegistration = (req, res, next) => {
    const userRegistrationSchema = Joi.object({
      fullname: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z ]+$'))
        .messages({
          'any.required': 'Fullname is required.',
          'string.empty': 'Fullname cannot be empty.',
          'string.base': 'Fullname must be a string.',
          'string.pattern.base': 'Fullname should only contain alphabetic characters and spaces.',
        }),
      mobile: Joi.string()
        .required()
        .length(10)
        .pattern(new RegExp('^[0-9]+$'))
        .messages({
          'any.required': 'Mobile number is required.',
          'string.empty': 'Mobile number cannot be empty.',
          'string.length': 'Mobile number should be 10 digits.',
          'string.pattern.base': 'Mobile number should only contain numeric digits.',
        }),
      email: Joi.string().email().required().messages({
        'any.required': 'Email is required.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Please enter a valid email address.',
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required.',
        'string.empty': 'Password cannot be empty.',
      }),
    });
  
    const { error } = userRegistrationSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next(); 
};

module.exports = {validateUserRegistration}