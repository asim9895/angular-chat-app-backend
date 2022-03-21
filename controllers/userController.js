const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({ error: errors.array() });
		}
		let usernameExists = await User.findOne({ username });
		let emailExists = await User.findOne({ email });

		if (usernameExists) {
			return res.status(401).send({ error: [{ msg: 'Username Exists' }] });
		}

		if (emailExists) {
			return res.status(401).send({ error: [{ msg: 'Email Exists' }] });
		}

		let user = new User({
			username,
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		res.status(200).send({ message: 'success' });
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(401).send({ error: errors.array() });
		}
		let user = await User.findOne({ username });

		if (!user) {
			return res.status(401).send({ error: [{ msg: 'Invalid Credentials' }] });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).send({ error: [{ msg: 'Invalid Credentials' }] });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, process.env.JWT_SECRET, async (err, token) => {
			if (err) throw Error(err);
			res.cookie('auth', token);
			res.status(200).json({ message: 'success', token });
		});
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

exports.all_users = async (req, res) => {
	try {
		const users = await User.find().select('-password').sort({ updatedAt: -1 });

		if (!users) {
			return res.status(401).send({ errors: [{ msg: 'No Users Found' }] });
		}

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

exports.search_user = async (req, res) => {
	const { username } = req.body;
	try {
		const users = await User.find({ username: { $regex: username } })
			.select('-password')
			.sort({ updatedAt: -1 });

		if (!users) {
			return res.status(401).send({ errors: [{ msg: 'No Users Found' }] });
		}

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

exports.current_user = async (req, res) => {
	let user = await User.findById(req.user.id)
		.populate('following.user', '_id username')
		.populate('followers.user', '_id username')
		.populate('notifications.sender', '_id username')
		.populate('saved.post');

	try {
		if (!user) {
			return res.status(401).send({ errors: [{ msg: 'No User Found' }] });
		}
		res.status(200).json({ user: user });
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

exports.follow_user = async (req, res) => {
	const { other_user_id } = req.body;
	try {
		let user = await User.findById(req.user._id);
		let other_user = await User.findById(other_user_id);

		if (
			user.following.some((follow) => follow.user.toString() === other_user_id)
		) {
			return res.status(400).json({ msg: 'Already Following' });
		}

		user.following.unshift({ user: other_user_id });
		other_user.followers.unshift({ user: req.user._id });
		other_user.notifications.unshift({
			sender: req.user._id,
			message: `is now following you`,
			createdAt: new Date(),
			viewProfile: false,
		});

		await user.save();
		await other_user.save();

		return res.json({
			user,
			other_user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: [{ msg: 'Server Error' }] });
	}
};

exports.unfollow_user = async (req, res) => {
	const { other_user_id } = req.body;
	let user_id = req.user.id;
	try {
		const user = await User.findById(req.user._id);
		const other_user = await User.findById(other_user_id);

		if (
			!user.following.some((follow) => follow.user.toString() === other_user_id)
		) {
			return res.status(400).json({ msg: 'User not followed yet' });
		}

		other_user.followers = await other_user.followers.filter((followers) => {
			return followers.user.toString() !== user_id;
		});
		other_user.notifications.unshift({
			sender: req.user._id,
			message: `has unfollowed you`,
			createdAt: new Date(),
			viewProfile: false,
		});
		user.following = await user.following.filter(
			({ user }) => user.toString() !== other_user_id
		);

		await user.save();
		await other_user.save();

		return res.json({
			user,
			other_user,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
};
