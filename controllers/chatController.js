const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

let user_excluding_fields = {
	password: 0,
	saved: 0,
	followers: 0,
	following: 0,
	notifications: 0,
	chatList: 0,
};

exports.send_message = async (req, res) => {
	let { sender, receiver, message } = req.body;
	try {
		let result = await Conversation.find({
			$or: [
				{
					participants: {
						$elemMatch: {
							sender,
							receiver,
						},
					},
				},
				{
					participants: {
						$elemMatch: {
							sender: receiver,
							receiver: sender,
						},
					},
				},
			],
		});

		if (result.length > 0) {
			let msg = await Message.findOne({ conversation: result[0]._id });
			await Message.update(
				{
					conversation: result[0]._id,
				},
				{
					$push: {
						message: {
							sender,
							receiver,
							message,
						},
					},
				}
			);

			await User.update(
				{
					_id: sender,
				},
				{
					$pull: {
						chatList: {
							receiver,
						},
					},
				}
			);

			await User.update(
				{
					_id: receiver,
				},
				{
					$pull: {
						chatList: {
							receiver: sender,
						},
					},
				}
			);

			await User.update(
				{
					_id: sender,
				},
				{
					$push: {
						chatList: {
							$each: [
								{
									receiver,
									message: msg._id,
								},
							],
							$position: 0,
						},
					},
				}
			);

			await User.update(
				{
					_id: receiver,
				},
				{
					$push: {
						chatList: {
							$each: [
								{
									receiver: sender,
									message: msg._id,
								},
							],
							$position: 0,
						},
					},
				}
			);

			return res.status(200).json({ message: 'second message' });
		} else {
			let newConversation = new Conversation();

			newConversation.participants.push({ sender, receiver });
			let saveConvo = await newConversation.save();

			let newMessage = new Message();

			newMessage.conversation = saveConvo._id;
			newMessage.sender = sender;
			newMessage.receiver = receiver;
			newMessage.message.push({
				sender,
				receiver,
				message,
			});

			await User.update(
				{
					_id: sender,
				},
				{
					$push: {
						chatList: {
							$each: [
								{
									receiver,
									message: newMessage._id,
								},
							],
							$position: 0,
						},
					},
				}
			);

			await User.update(
				{
					_id: receiver,
				},
				{
					$push: {
						chatList: {
							$each: [
								{
									receiver: sender,
									message: newMessage._id,
								},
							],
							$position: 0,
						},
					},
				}
			);

			await newMessage.save();

			res.status(200).json({ message: 'message sent' });
		}
	} catch (error) {
		console.log(error);
	}
};

exports.all_chats_messages = async (req, res) => {
	const { sender, receiver } = req.body;
	try {
		const conversation = await Conversation.findOne({
			$or: [
				{
					$and: [
						{
							'participants.sender': sender,
							'participants.receiver': receiver,
						},
					],
				},
				{
					$and: [
						{
							'participants.sender': receiver,
							'participants.receiver': sender,
						},
					],
				},
			],
		}).select('_id');

		let messages = await Message.findOne({
			conversation: conversation._id,
		}).sort({ createdAt: -1 });

		res.status(200).json({ messages });
	} catch (error) {
		console.log(error);
		res.status(500).json('server error');
	}
};
