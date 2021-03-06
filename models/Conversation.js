const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				sender: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				receiver: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
