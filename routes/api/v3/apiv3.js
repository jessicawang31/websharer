import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';
import commentsRouter from './controllers/comments.js';

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);
router.use('/comments', commentsRouter);

export default router;