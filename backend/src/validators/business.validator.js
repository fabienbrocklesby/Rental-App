import Joi from 'joi';

// export default (data, required = []) => Joi.object().keys({
//   website: Joi.string()
//     .uri()
//     .required(),
//   email: Joi.string()
//     .min(3)
//     .max(70)
//     .required()
//     .email(),
// })
//   .fork(required, (field) => field.required())
//   .validateAsync(data);

export const validateWebsite = (data, required = []) => Joi.object().keys({
  website: Joi.string()
    .uri()
    .required(),
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
