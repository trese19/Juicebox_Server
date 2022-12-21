
// import
const express = require('express');
const apiRouter = express.Router();


// add token
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

// give user a token, sign with secret
const token = jwt.sign({id: 3, username: 'glamgal'}, 'server secret', {expiresIn: '1week'}, process.env.JWT_SECRET);

token;
console.log('token', token)

// verify that token and secret are the same, it returns payload
const recoveredData = jwt.verify(token, 'server secret');
console.log('recoveredData', recoveredData)

recoveredData;

jwt.verify(token, 'server secret');

// middleware
// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});



// attach to apiRouter
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

module.exports = apiRouter;

// add error handler
apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
    // token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJnbGFtZ2FsIiwiaWF0IjoxNjcxNTgxNDk0LCJleHAiOjE2NzIxODYyOTR9.bsLtBUGafw8VeYGsRrzcuyUwz-WXytE0FfFL6HiZPfY
  });
});

module.exports = apiRouter;