const Joi = require('@hapi/joi')

module.exports = {
  login: () => {
    return Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Email must be a valid email address',
          'any.required': 'Email is required'
        }),
      password: Joi.string()
        .min(4)
        .required()
        .messages({
          'string.base': `Password Should be a type of 'text'`,
          'string.min': `Password Should have a minimum length of {#limit}`,
          'any.required': `Password is Required!`,
          'string.base': `Password Should be a type of 'text'`
        })
    })
  },
  register: () => {
    return Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Email must be a valid email address',
          'any.required': 'Email is required'
        }),
      password: Joi.string()
        .min(8)
        .required()
        .messages({
          'string.base': `Password Should be a type of 'text'`,
          'string.min': `Password Should have a minimum length of {#limit}`,
          'any.required': `Password is Required!`,
          'string.base': `Password Should be a type of 'text'`
        }),
      confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required(),
      name: Joi.string()
        .required()
        .messages({
          'any.required': 'Email is required'
        })
    })
  }
}
