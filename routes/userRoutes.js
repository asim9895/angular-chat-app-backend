const express = require('express');
const {
	register,
	login,
	all_users,
	current_user,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const {
	registerValidation,
	loginvalidations,
} = require('../validations/userValidation');
const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginvalidations, login);

router.post('/current_user', auth, current_user);
router.post('/all_users', auth, all_users);

module.exports = router;
