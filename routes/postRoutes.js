const express = require('express');
const {
	add_post,
	all_posts,
	add_like,
	remove_like,
	post_by_id,
	add_comment,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { commentValidations } = require('../validations/commentValidation');
const { postValidations } = require('../validations/postValidation');
const router = express.Router();

router.post('/add-post', [postValidations, auth], add_post);
router.post('/add-like', auth, add_like);
router.post('/remove-like', auth, remove_like);
router.post('/all-posts', auth, all_posts);
router.post('/post-by-id', auth, post_by_id);
router.post('/add-comment', [commentValidations, auth], add_comment);

module.exports = router;
