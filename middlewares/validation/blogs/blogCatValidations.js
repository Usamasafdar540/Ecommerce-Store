const Joi = require('joi');

const createCategoryValidation = Joi.object({
  title: Joi.string().required(),
});

const getaProductsCatValidation = Joi.object({
  id: Joi.string().required(),
});

const updatePCategoryValidation = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
});

const deletePCategoryValidation = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  createCategoryValidation,
  getaProductsCatValidation,
  updatePCategoryValidation,
  deletePCategoryValidation,
};
