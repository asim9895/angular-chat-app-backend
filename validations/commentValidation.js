const { check } = require('express-validator');

exports.commentValidations = [
	check('comment').not().isEmpty().withMessage('Comment is required'),
];
