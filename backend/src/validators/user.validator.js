import Joi from 'joi';

export const validateUsername = (data, required = []) => Joi.object().keys({
  username: Joi.string()
    .min(2)
    .max(60)
    .required()
    .regex(/^\S*$/),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);

export const validateEmail = (data, required = []) => Joi.object().keys({
  email: Joi.string()
    .min(3)
    .max(70)
    .required()
    .email(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);
