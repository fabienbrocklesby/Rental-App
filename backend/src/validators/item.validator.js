import Joi from 'joi';

export const validateId = (data, required = []) => Joi.object().keys({
  id: Joi.string()
    .uuid()
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateName = (data, required = []) => Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(70)
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateDescription = (data, required = []) => Joi.object().keys({
  description: Joi.string()
    .min(3)
    .max(300)
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validatePrice = (data, required = []) => Joi.object().keys({
  price: Joi.number()
    .min(0)
    .max(1000000)
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateLocation = (data, required = []) => Joi.object().keys({
  location: Joi.string()
    .min(1)
    .max(200)
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateExternalUrl = (data, required = []) => Joi.object().keys({
  externalUrl: Joi.string()
    .uri()
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateIpAddress = (data, required = []) => Joi.object().keys({
  ipAddress: Joi.string()
    .ip()
    .required(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);
