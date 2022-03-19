const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	following: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		},
	],
	followers: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		},
	],
	saved: [
		{
			post: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		},
	],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
