import Joi from 'joi';

export default (data, required = []) => Joi.object().keys({
  email: Joi.string()
    .min(3)
    .max(70)
    .email(),
  username: Joi.string()
    .min(2)
    .max(60)
    .regex(/^\S*$/),
  otp: Joi.string()
    .min(6)
    .max(6)
    .regex(/^[A-Za-z0-9]+$/),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);
