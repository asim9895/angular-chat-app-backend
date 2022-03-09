const express = require('express');
const { add_post, all_posts } = require('../controllers/postController');
const auth = require('../middleware/auth');
const { postValidations } = require('../validations/postValidation');
const router = express.Router();

router.post('/add-post', [postValidations, auth], add_post);
router.post('/all-posts', auth, all_posts);

module.exports = router;
