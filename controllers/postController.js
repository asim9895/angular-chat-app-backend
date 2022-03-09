const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.add_post = async (req, res) => {
	const { post } = req.body;
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({ error: errors.array() });
		}

		let new_post = new Post({ post, user: req.user._id });

		await new_post.save();

		res.status(200).send({ message: 'success', new_post });
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.all_posts = async (req, res) => {
	try {
		let posts = await Post.find().populate('user', '_id username');

		if (!posts) {
			return res.status(400).send({ errors: [{ msg: 'No Posts Found' }] });
		}

		res.status(200).send({ posts });
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};
