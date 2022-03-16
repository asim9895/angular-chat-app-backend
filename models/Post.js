const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: String,
			required: true,
		},
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				comment: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now(),
				},
			},
		],
		likes: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				createdAt: {
					type: Date,
					default: Date.now(),
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
