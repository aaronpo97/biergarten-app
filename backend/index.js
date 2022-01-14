import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import PassportLocal from 'passport-local';

import ServerError from './utilities/errors/ServerError.js';
import { ErrorResponse, SuccessResponse } from './utilities/response/responses.js';

import connectDB from './database/connectDB.js';
import User from './database/models/User.js';

import beerRoutes from './routes/beerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import breweryRoutes from './routes/breweryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

import checkTokens from './middleware/auth/checkTokens.js';
import verifyAccessToken from './middleware/auth/verifyAccessToken.js';

// use the environment variables in local .env when not in production (dev)
if (process.env.NODE_ENV !== 'production') dotenv.config();

const { PORT, MONGO_DB_URI, BASE_URL } = process.env;

const app = express();

const initializeDB = async () => {
	await connectDB(MONGO_DB_URI);
	console.clear();
	console.log('The Biergarten API \n');
	console.log('Connected to MongoDB.');
};

// Enable cross origin resource sharing (dev only)
if (process.env.NODE_ENV === 'development') app.use(cors());

// To parse the incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport.js
app.use(passport.initialize());
passport.use(new PassportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.all('/teapot', () => {
	throw new ServerError(`I'm a teapot!`, 418);
});

app.get('/verifytoken', checkTokens, verifyAccessToken, (req, res, next) => {
	res.json(
		new SuccessResponse(
			`Successfully verified ${req.currentUser.username}.`,
			200,
			undefined,
			req.didTokenRegenerate ? req.accessToken : undefined
		)
	);
});

// Express router:
app.use('/beers', beerRoutes);
app.use('/users', userRoutes);
app.use('/breweries', breweryRoutes);
app.use('/images', imageRoutes);

// Error handling:
app.use((err, req, res, next) => {
	const { status = 500, message = 'Oh no, something went wrong.', stack } = err;
	res.status(status).json(
		new ErrorResponse(message, status, process.NODE_ENV !== 'production' ? stack : undefined)
	);
});

app.listen(PORT, () => {
	console.clear();
	console.log('Loading the Biergarten API...');
	initializeDB().then(() => console.log(`Connected to '${BASE_URL}${PORT}'.`));
});
