const Joi = require("joi");
const validateMongoId = require("../../../utils/validateMongoDbId");

const cartItemSchema = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!validateMongoId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
  count: Joi.number().integer().min(1).required(),
  color: Joi.string().optional(),
});

const userCartValidation = Joi.object({
  cart: Joi.array().items(cartItemSchema).min(1).required(),
});

module.exports = {
  userCartValidation,
};
