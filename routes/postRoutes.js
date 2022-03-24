const express = require('express');
const {
	add_post,
	all_posts,
	add_like,
	remove_like,
	post_by_id,
	add_comment,
	unsave_post,
	save_post,
	remove_comment,
	random_posts,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const { commentValidations } = require('../validations/commentValidation');
const { postValidations } = require('../validations/postValidation');
const router = express.Router();

router.post('/add-post', [postValidations, auth], add_post);

router.put('/add-like', auth, add_like);
router.put('/remove-like', auth, remove_like);

router.post('/all-posts', auth, all_posts);
router.post('/random-posts', random_posts);
router.post('/post-by-id', auth, post_by_id);

router.post('/add-comment', [commentValidations, auth], add_comment);
router.post('/remove-comment', auth, remove_comment);

router.put('/save-post', auth, save_post);
router.put('/unsave-post', auth, unsave_post);

module.exports = router;
