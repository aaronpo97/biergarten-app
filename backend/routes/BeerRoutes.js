import express from 'express';

import getAllPosts from '../controllers/posts/getAllPosts.js';
import showBeerPost from '../controllers/posts/showBeerPost.js';
import createBeerPost from '../controllers/posts/createBeerPost.js';
import deleteBeerPost from '../controllers/posts/deleteBeerPost.js';
import updateBeerPost from '../controllers/posts/updateBeerPost.js';

import validateBeerPost from '../middleware/validation/validateBeerPost.js';
import verifyAccessToken from '../middleware/auth/verifyAccessToken.js';
import isPostOwner from '../middleware/auth/isPostOwner.js';
import checkTokens from '../middleware/auth/checkTokens.js';

const router = express.Router();

router
	.route('/')
	.get(checkTokens, verifyAccessToken, getAllPosts)
	.post(checkTokens, verifyAccessToken, validateBeerPost, createBeerPost);

router
	.route('/:id')
	.get(checkTokens, verifyAccessToken, showBeerPost)
	.put(checkTokens, verifyAccessToken, isPostOwner, updateBeerPost)
	.delete(checkTokens, verifyAccessToken, isPostOwner, deleteBeerPost);

export default router;
