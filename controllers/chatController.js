exports.send_message = async (req, res) => {
	let { sender, receiver, message } = req.body;
	try {
		res.status(200).json({
			sender, receiver, message
		});
	} catch (error) {
		console.log(error);
	}
};
