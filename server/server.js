const express = require('express');
const connectDb = require('../database/mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRoutes = require('../routes/userRoutes');
const postRoutes = require('../routes/postRoutes');
const chatRoutes = require('../routes/chatRoutes');

const { Server } = require('socket.io');

require('dotenv').config();
connectDb();

const app = express();
const port = process.env.PORT || 3200;

const server = require('http').createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type,Accept,authorization'
	);

	next();
});

require('../socket/streams')(io);
require('../socket/private')(io);

app.use('/api/chat-app', userRoutes);
app.use('/api/chat-app', postRoutes);
app.use('/api/chat-app', chatRoutes);

server.listen(port, () => {
	console.log(`server is running at port ${port}`);
});
