const express = require('express');
const {
	add_post,
	all_posts,
	add_like,
	remove_like,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { remove } = require('../models/Post');
const { postValidations } = require('../validations/postValidation');
const router = express.Router();

router.post('/add-post', [postValidations, auth], add_post);
router.post('/add-like', auth, add_like);
router.post('/remove-like', auth, remove_like);
router.post('/all-posts', auth, all_posts);

module.exports = router;
