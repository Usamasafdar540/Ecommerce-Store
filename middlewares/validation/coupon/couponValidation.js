const Joi = require('joi');

const createCouponValidation = Joi.object({
  name: Joi.string().required(),
  expiry: Joi.date().iso().required(),
  discount: Joi.number().min(0).max(100).required(),
});

const getSingleCouponValidation = Joi.object({
  id: Joi.string().required(),
});

const updateCouponValidation = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  expiry: Joi.date().iso().required(),
  discount: Joi.number().min(0).max(100).required(),
});

const deleteCouponValidation = Joi.object({
  id: Joi.string().required(),
});

const applyCouponValidation = Joi.object({
  coupon: Joi.string().required(),
});

module.exports = {
  createCouponValidation,
  getSingleCouponValidation,
  updateCouponValidation,
  deleteCouponValidation,
  applyCouponValidation,
};
