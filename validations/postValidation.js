const { check } = require('express-validator');

exports.postValidations = [
	check('post').not().isEmpty().withMessage('Post is required'),
];
