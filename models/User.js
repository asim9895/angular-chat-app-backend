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
	notifications: [
		{
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			message: {
				type: String,
			},
			viewProfile: {
				type: Boolean,
				default: false,
			},
			createdAt: {
				type: Date,
				default: Date.now(),
			},
			read: {
				type: Boolean,
				default: false,
			},
			date: {
				type: String,
				default: '',
			},
		},
	],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
