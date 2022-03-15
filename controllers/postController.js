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
		let posts = await Post.find()
			.populate('user', '_id username')
			.sort({ createdAt: -1 });

		if (!posts) {
			return res.status(400).send({ errors: [{ msg: 'No Posts Found' }] });
		}

		res.status(200).send({ posts });
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.add_like = async (req, res) => {
	const { post_id } = req.body;
	try {
		const post = await Post.findById(post_id);

		// Check if the post has already been liked
		if (post.likes.some((like) => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		post.likes.unshift({ user: req.user.id });

		await post.save();

		return res.json(post.likes);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.remove_like = async (req, res) => {
	const { post_id } = req.body;
	try {
		const post = await Post.findById(post_id);

		// Check if the post has not yet been liked
		if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post has not yet been liked' });
		}

		// remove the like
		post.likes = post.likes.filter(
			({ user }) => user.toString() !== req.user.id
		);

		await post.save();

		return res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
