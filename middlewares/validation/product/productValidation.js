const joi = require("joi");
const createProductValidations = joi.object({
  title: joi.string().required(),
//   slug: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(), // Update to number
  quantity: joi.number().required(), // Update to number
  category: joi.string().required(),
  brand: joi.string().required(),
  color: joi.string().required(),
});

module.exports = {
  createProductValidations,
};
