import Joi from 'joi';

const username = Joi.string()
  .required()
  .trim()
  .lowercase()
  .pattern(new RegExp('^[a-z.]{3,32}$'));
const password = Joi.string()
  .required()
  .trim()
  // > 6 zeichen, 1 groß, 1 klein und 1 zahl
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}$)'));
const repeat_password = Joi.ref('password');
const station = Joi.number().required();

// /@starcar\.de/

const user = Joi.object().keys({
  username,
  password,
  repeat_password,
  station,
});

export default user;
