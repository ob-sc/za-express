import Joi from 'joi';

const username = Joi.string().required().trim().lowercase().pattern(new RegExp('^[a-z.-]{1,}$'));
const password = Joi.string()
  .required()
  // > 6, 1 klein, 1 groß & 1 zahl
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})'));
const repeat_password = Joi.any().equal(Joi.ref('password')).required();
const station = Joi.number().required();

const user = Joi.object().keys({
  username,
  password,
  repeat_password,
  station,
});

export default user;
