const Joi = require('joi');

const createOrderValidation = Joi.object({
  COD: Joi.boolean().required(),
  couponApplied: Joi.boolean().required(),
});

const getOrderByUserIdValidation = Joi.object({
  id: Joi.string().required(),
});

const updateOrderStatusValidation = Joi.object({
  status: Joi.string().required(),
});

module.exports = {
  createOrderValidation,
  getOrderByUserIdValidation,
  updateOrderStatusValidation,
};
