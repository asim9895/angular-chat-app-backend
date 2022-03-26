exports.send_message = async (req, res) => {
	try {
		res.status(200).send('message sent');
	} catch (error) {
		console.log(error);
	}
};
