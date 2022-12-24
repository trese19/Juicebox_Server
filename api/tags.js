const express = require('express');
const tagsRouter = express.Router();
const {getPostsByTagName} = ('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); 
});

const { getAllTags } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
  
    res.send({
      tags 
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    try {
    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
     console.log(req.params);
     const {tagName} = req.params;
     const post = await getPostsByTagName(tagName);

      // the post is not active & doesn't belong to the current user
     const posts = allPosts.filter(post => {
      return post.inactive || (req.user && post.author.id !== req.user.id);
     })

      res.send(post);
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next(error);
    }
  });

module.exports = tagsRouter;