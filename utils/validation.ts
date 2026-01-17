import Joi from 'joi';
import { RegisterRequestBody, LoginRequestBody, UpdateUserRequestBody } from '../types/user';

/**
 * 验证注册请求体
 * @param {any} body - 请求体
 * @returns {Joi.ValidationResult<RegisterRequestBody>} 验证结果
 */
export const validateRegisterBody = (body: any): Joi.ValidationResult<RegisterRequestBody> => {
    const schema = Joi.object<RegisterRequestBody>({
        username: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                'string.base': 'Username must be a string',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must be at most 20 characters long',
                'any.required': 'Username is required'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.base': 'Email must be a string',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(8)
            .max(50)
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password must be at most 50 characters long',
                'any.required': 'Password is required'
            }),
        nickname: Joi.string()
            .max(50)
            .allow(null)
            .messages({
                'string.base': 'Nickname must be a string',
                'string.max': 'Nickname must be at most 50 characters long'
            }),
        avatar: Joi.string()
            .uri()
            .max(255)
            .allow(null)
            .messages({
                'string.base': 'Avatar must be a string',
                'string.uri': 'Avatar must be a valid URL',
                'string.max': 'Avatar URL must be at most 255 characters long'
            }),
        gender: Joi.string()
            .valid('male', 'female', 'other')
            .allow(null)
            .messages({
                'string.base': 'Gender must be a string',
                'any.only': 'Gender must be one of: male, female, other'
            }),
        birthday: Joi.date()
            .iso()
            .allow(null)
            .messages({
                'date.base': 'Birthday must be a valid date',
                'date.iso': 'Birthday must be in ISO format (YYYY-MM-DD)'
            }),
        phone: Joi.string()
            .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
            .max(20)
            .allow(null)
            .messages({
                'string.base': 'Phone must be a string',
                'string.pattern.base': 'Phone must be a valid phone number',
                'string.max': 'Phone number must be at most 20 characters long'
            })
    });
    
    return schema.validate(body, { abortEarly: false });
};

/**
 * 验证登录请求体
 * @param {any} body - 请求体
 * @returns {Joi.ValidationResult<LoginRequestBody>} 验证结果
 */
export const validateLoginBody = (body: any): Joi.ValidationResult<LoginRequestBody> => {
    const schema = Joi.object<LoginRequestBody>({
        email: Joi.string()
            .email()
            .optional()
            .messages({
                'string.base': 'Email must be a string',
                'string.email': 'Email must be a valid email address'
            }),
        username: Joi.string()
            .optional()
            .messages({
                'string.base': 'Username must be a string'
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'any.required': 'Password is required'
            })
    }).or('email', 'username')
      .messages({
          'object.missing': 'Either email or username is required'
      });
    
    return schema.validate(body, { abortEarly: false });
};

/**
 * 验证用户更新请求体
 * @param {any} body - 请求体
 * @returns {Joi.ValidationResult<UpdateUserRequestBody>} 验证结果
 */
export const validateUpdateUserBody = (body: any): Joi.ValidationResult<UpdateUserRequestBody> => {
    const schema = Joi.object<UpdateUserRequestBody>({
        nickname: Joi.string()
            .max(50)
            .allow(null)
            .messages({
                'string.base': 'Nickname must be a string',
                'string.max': 'Nickname must be at most 50 characters long'
            }),
        avatar: Joi.string()
            .uri()
            .max(255)
            .allow(null)
            .messages({
                'string.base': 'Avatar must be a string',
                'string.uri': 'Avatar must be a valid URL',
                'string.max': 'Avatar URL must be at most 255 characters long'
            }),
        gender: Joi.string()
            .valid('male', 'female', 'other')
            .allow(null)
            .messages({
                'string.base': 'Gender must be a string',
                'any.only': 'Gender must be one of: male, female, other'
            }),
        birthday: Joi.date()
            .iso()
            .allow(null)
            .messages({
                'date.base': 'Birthday must be a valid date',
                'date.iso': 'Birthday must be in ISO format (YYYY-MM-DD)'
            }),
        phone: Joi.string()
            .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
            .max(20)
            .allow(null)
            .messages({
                'string.base': 'Phone must be a string',
                'string.pattern.base': 'Phone must be a valid phone number',
                'string.max': 'Phone number must be at most 20 characters long'
            })
    });
    
    return schema.validate(body, { abortEarly: false });
};
