const joi = require("joi");
const createCategoryValidations = joi.object({
  title: joi.string().required(),

});

module.exports = {
    createCategoryValidations,
};
