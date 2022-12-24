const express = require('express');
const postsRouter = express.Router();
const { requireUser } = require('./utils');
const {updatePost, getPostById} = ('../db');

postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter(post => {
      // keep a post if it is either active, or if it belongs to the current user
      // the post is active, doesn't matter who it belongs to
        if (post.active) {
          return true;
        }
      
        // the post is not active, but it belogs to the current user
        if (req.user && post.author.id === req.user.id) {
          return true;
        }
      
        // none of the above are true
        return false;
      });
    
    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    // res.send({ message: 'under construction' });
    
    const { title, content, tags, authorId = "" } = req.body;
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
    
    // only send the tags if there are some to send
    if (tagArr.length) {
      postData.tags = tagArr;
    }
    
    try {
    const post = await createPost(postData, title, content, tags, authorId);
    
    res.send(createPost);
  } catch ({error }) {
    next({ error });
  }
});


postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); 
});

const { getAllPosts } = require('../db');

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts 
    });
  });

module.exports = postsRouter;