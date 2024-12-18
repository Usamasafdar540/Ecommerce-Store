const Joi = require('joi');
const validateMongoId = require('../../../utils/validateMongoDbId');
//Used requrest.body in both the requrests thatss why added no validations for thes two yet
const createBlogValidation = Joi.object({

});

const updateBlogValidation = Joi.object({

});

const likeDislikeBlogValidation = Joi.object({
  blogId: Joi.string().custom((value, helpers) => {
    if (!validateMongoId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
});

module.exports = {
  createBlogValidation,
  updateBlogValidation,
  likeDislikeBlogValidation,
};
