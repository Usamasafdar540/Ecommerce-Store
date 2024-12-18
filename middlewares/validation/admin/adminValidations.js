const Joi = require('joi');
const validateMongoId = require('../../../utils/validateMongoDbId');

const addAdminValidation = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
});

const updateUserValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
});

const activateDeactivateUserValidation = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!validateMongoId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
});
