const express = require('express');
const connectDb = require('../database/mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const userRoutes = require('../routes/userRoutes');

require('dotenv').config();
connectDb();

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

app.use('/api/chat-app', userRoutes);

app.listen(port, () => {
	console.log(`server is running at port ${port}`);
});
