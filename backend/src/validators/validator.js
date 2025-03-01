import { check } from 'express-validator';

export const registerValidator = [
    check('username')
                   .notEmpty().withMessage('Username is required')
                   .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),


    check('email')
                 .notEmpty().withMessage('Email is required')
                 .isEmail().withMessage('Invalid email address'),


    check('password')
                 .notEmpty().withMessage('Password is required')
                 .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];


export const loginValidator = [
    check('email').notEmpty().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
];



