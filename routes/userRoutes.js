const express = require('express');
const {
	register,
	login,
	all_users,
	current_user,
	search_user,
	follow_user,
	unfollow_user,
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
router.post('/all-users', auth, all_users);
router.post('/search-users', auth, search_user);

router.post('/follow-user', auth, follow_user);
router.post('/unfollow-user', auth, unfollow_user);

module.exports = router;
