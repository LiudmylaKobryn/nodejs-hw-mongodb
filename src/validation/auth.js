import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Name is required!',
  }),
  email: Joi.string().required().email().messages({
    'any.required': 'Email is required!',
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().required().min(6).max(20).messages({
    'any.required': 'Password is required!',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'any.required': 'Email is required!',
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().required().min(6).max(20).messages({
    'any.required': 'Password is required!',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Email is required!',
    'string.email': 'Email must be a valid email',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(6).max(20).messages({
    'any.required': 'Password is required!',
  }),
  token: Joi.string().required(),
});
