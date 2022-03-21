const Post = require('../models/Post');
const User = require('../models/User');
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

		res.status(200).send({
			posts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.post_by_id = async (req, res) => {
	const { post_id } = req.body;
	try {
		let post = await Post.findById(post_id)
			.populate('user', '_id username')
			.populate('comments.user', '_id username')
			.populate('likes.user', '_id username')
			.populate('saved.user', '_id username');

		if (!post) {
			return res.status(400).send({ errors: [{ msg: 'No Posts Found' }] });
		}

		res.status(200).send({ post });
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

		post.likes.unshift({ user: req.user.id, createdAt: post.updatedAt });

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

exports.add_comment = async (req, res) => {
	const { post_id, comment } = req.body;
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({ error: errors.array() });
		}
		const post = await Post.findById(post_id);

		const newComment = {
			comment,
			user: req.user.id,
			createdAt: post.updatedAt,
		};

		post.comments.unshift(newComment);

		await post.save();

		res.json({ message: 'success' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.remove_comment = async (req, res) => {
	const { post_id, comment_id } = req.body;

	try {
		const post = await Post.findById(post_id);
		console.log(post_id);
		console.log(comment_id);
		console.log(post);
		// Pull out comment
		const comment = await post.comments.find(
			(comment) => comment.id === comment_id
		);
		console.log(comment);
		// Make sure comment exists
		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exist' });
		}
		// Check user
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		post.comments = post.comments.filter(({ id }) => id !== comment_id);

		await post.save();

		return res.json(post.comments);
	} catch (err) {
		console.error(err);
		return res.status(500).send('Server Error');
	}
};

exports.save_post = async (req, res) => {
	const { post_id } = req.body;
	try {
		const post = await Post.findById(post_id);
		const user = await User.findById(req.user.id);

		// Check if the post has already been liked
		if (post.saved.some((saved) => saved.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post already saved' });
		}

		post.saved.unshift({ user: req.user.id, createdAt: post.updatedAt });
		user.saved.unshift({ post: post, createdAt: post.updatedAt });

		await post.save();
		await user.save();

		return res.json(post.saved);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.unsave_post = async (req, res) => {
	const { post_id } = req.body;
	try {
		const post = await Post.findById(post_id);
		const user = await User.findById(req.user.id);

		// Check if the post has not yet been liked
		if (!post.saved.some((saved) => saved.user.toString() === req.user.id)) {
			return res.status(400).json({ msg: 'Post has not yet been saved' });
		}

		// remove the like
		post.saved = post.saved.filter(
			({ user }) => user.toString() !== req.user.id
		);
		user.saved = user.saved.filter(({ post }) => post.toString() !== post_id);

		await post.save();
		await user.save();

		return res.json(post.saved);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
