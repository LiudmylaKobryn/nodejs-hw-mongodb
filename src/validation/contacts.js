import Joi from 'joi';
import JoiPhoneNumber from 'joi-phone-number';

const extendedJoi = Joi.extend(JoiPhoneNumber);

export const createContactSchema = extendedJoi.object({
  name: extendedJoi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be at least 3 characters',
    'string.empty': 'Name cannot be empty',
    'string.max': 'Name should be at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: extendedJoi.string().phoneNumber().required().messages({
    'any.required': 'Phone number is required',
    'string.phoneNumber': 'Invalid phone number format',
  }),
  email: extendedJoi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: extendedJoi.boolean(),
  contactType: extendedJoi
    .string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .required(),
});

export const updateContactSchema = extendedJoi.object({
  name: extendedJoi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be at least 3 characters',
    'string.max': 'Name should be at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: extendedJoi.string().phoneNumber().messages({
    'string.phoneNumber': 'Invalid phone number format',
  }),
  email: extendedJoi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  isFavourite: extendedJoi.boolean(),
  contactType: extendedJoi
    .string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});
