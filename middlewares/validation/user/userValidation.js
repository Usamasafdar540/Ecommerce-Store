const joi = require("joi");
const registerUserValidations = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  mobile: joi.string().max(11).required(),
  password: joi.string().min(8).required(),
  address: joi.string().required(),
  //   confirmPassword: joi.string().valid(joi.ref("password")).required(),
});
const loginUserValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
const updatePasswordValidation = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required().invalid(joi.ref("oldPassword")),
  })
  .messages({
    "any.invalid": '"newPassword" must be different from "oldPassword"',
  });
module.exports = {
  registerUserValidations,
  loginUserValidation,
  updatePasswordValidation,
};
