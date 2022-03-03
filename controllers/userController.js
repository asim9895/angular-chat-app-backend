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

exports.current_user = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).send({ errors: [{ msg: 'No User Found' }] });
		}
		res.status(200).json({ user: req.user });
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};
