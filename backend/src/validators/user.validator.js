import Joi from 'joi';

export default (data, required = []) => Joi.object().keys({
  username: Joi.string()
    .min(2)
    .max(60)
    .regex(/^\S*$/),
  email: Joi.string()
    .min(3)
    .max(70)
    .required()
    .email(),
})
  .fork(required, (field) => field.required())
  .validateAsync(data);
