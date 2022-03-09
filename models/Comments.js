const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
