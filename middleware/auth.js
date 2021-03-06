const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
	const token = req.cookies.auth || req.headers.authorization;

	try {
		if (!token) {
			return res.status(401).send({ errors: [{ msg: 'Not Authorized' }] });
		}

		let decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findOne({ _id: decoded.user.id }).select(
			'-password'
		);

		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		res.status(500).send('server error');
	}
};

module.exports = auth;
