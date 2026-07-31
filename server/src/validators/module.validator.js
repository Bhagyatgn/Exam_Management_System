const Joi = require("joi");


const moduleSchema = Joi.object({

    course_code: Joi.string()
        .required()
        .messages({
            "string.empty": "Course code is required"
        }),


    course_name: Joi.string()
        .required()
        .messages({
            "string.empty": "Course name is required"
        }),


    description: Joi.string()
        .allow("", null),


    teacher_id: Joi.string()
        .uuid()
        .allow(null)

});


module.exports = {
    moduleSchema
};