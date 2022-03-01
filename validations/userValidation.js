const { check } = require('express-validator');

exports.registerValidation = [
	check('username')
		.not()
		.isEmpty()
		.withMessage('Username is required')
		.isLength({ min: 3 })
		.withMessage('username must be 3 characters long')
		.isLength({ max: 20 })
		.withMessage('username cannot exceed more than 20 characters'),
	check('email')
		.not()
		.isEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Email is not valid'),
	check('password')
		.isLength({ min: 6, max: 12 })
		.withMessage('your password should have min and max length between 6-12')
		.matches(/\d/)
		.withMessage('your password should have at least one number')
		.matches(/[!@#$%^&*(),.?":{}|<>]/)
		.withMessage('your password should have at least one special character')
		.matches(/[A-Z]/)
		.withMessage('your password must contain atleast one capital letter'),
];

exports.loginvalidations = [
	check('username').not().isEmpty().withMessage('Username is required'),
	check('email')
		.not()
		.isEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Email is not valid'),
];
