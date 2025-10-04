const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        geometry: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).optional() 
        /*image: Joi.object({
      url: Joi.string().uri().allow("", null).optional()
    }).required()*/
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});