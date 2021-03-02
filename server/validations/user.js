import Joi from 'joi';

const username = Joi.string()
  .required()
  .trim()
  .lowercase()
  .pattern(new RegExp('^[a-z.]{3,32}$'));
const password = Joi.string()
  .required()
  .trim()
  // > 6 characters, 1 upper, 1 lower and 1 number
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}$)'));
const repeat_password = Joi.ref('password');
const station = Joi.number().required();

// /@starcar\.de/

const user = Joi.object()
  .keys({
    username,
    password,
    repeat_password,
    station,
  })
  .with('password', 'repeat_password');

export default user;
