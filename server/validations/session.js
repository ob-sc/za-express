import Joi from 'joi';

const username = Joi.string().required().trim().lowercase();
const password = Joi.string().required();

const session = Joi.object().keys({
  username,
  password,
});

export default session;
