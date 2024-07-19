import Joi  from "joi";
export const LoginSchema = joi.object({
  Email: Joi.string().email().required(),
  Password: Joi.string().min(6).required(),
});
export const RegisterSchema = joi.object({
  Email: Joi .string().email().required(),
  Password: Joi.string().min(6).required(),
  Username: Joi.string().required(),
});
