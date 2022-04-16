const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		conversation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Conversation',
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		message: [
			{
				sender: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				receiver: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				message: {
					type: String,
				},
				isRead: {
					type: Boolean,
					default: false,
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
