const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
	},
	{
		timestamps: true,
	}
);

const Like = mongoose.model('Like', likesSchema);

module.exports = Like;
