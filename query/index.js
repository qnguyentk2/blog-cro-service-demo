const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const axios = require('axios');

const app = express();
app.use(bodyParser.json()); // use to get data from req.body from client
app.use(cors());

// save all post 
const posts = {};

// get all posts data
app.get('/posts', (req, res) => {
    res.send(posts)
});

// recieved event from event bus 
app.post('/events', (req, res) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;

        const newPost = {
            id, title
        }

        posts[id] = { ...newPost, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;

        const post = posts[postId];
        const newComment = {
            id, content
        }

        // add new comment into comments of a post
        post?.comments?.push({...newComment});
    }

    console.info(posts);

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});
