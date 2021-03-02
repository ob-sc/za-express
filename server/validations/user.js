import Joi from 'joi';

const username = Joi.string().trim().min(3).max(30).required();
const password = Joi.string().trim().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'));
const repeat_password = Joi.ref('password');
const station = Joi.number().required();

// /@starcar\.de/

export const signUp = Joi.object()
  .keys({
    username,
    password,
    repeat_password,
    station,
  })
  .with('password', 'repeat_password');

export const signIn = Joi.object().keys({
  username,
  password,
});
