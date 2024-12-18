const Joi = require('joi');
const validateMongoId = require('../../../utils/validateMongoDbId');

const createBrandValidation = Joi.object({
  title: Joi.string().required(),
});

const updateBrandValidation = Joi.object({
  title: Joi.string().required(),
});

const getaBrandValidation = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!validateMongoId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
});

const deleteBrandValidation = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!validateMongoId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
});

module.exports = {
  createBrandValidation,
  updateBrandValidation,
  getaBrandValidation,
  deleteBrandValidation,
};
