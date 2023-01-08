const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json()); // use to get data from req.body from client
app.use(cors());

// comments Data Mockup
const commentsByPostId = {};

// // get all comments on a postId
// app.get('/posts/:id/comments', (req, res) => {
//     const { id } = req.params;
//     // send data to client
//     res.send(commentsByPostId[id] || []);
// });

// create a comment for a postId
app.post('/posts/:id/comments', async (req, res) => {
     // create a random ID with 4 bytes and in hex string
     const commentId = randomBytes(4).toString('hex');

     const { content } = req.body;
     const { id } = req.params; // postId

    // get the comments of the postId on database
    const comments = commentsByPostId[id] || [];

    const newComment = {
        id: commentId,
        content,
    }

    // Add the new comment
    comments.push({...newComment});

    // save comment post into database of service comment
    commentsByPostId[id] = comments;

    // send event to events bus to create new comment
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            ...newComment,
            postId: id
        }
    }).catch(error => {
        console.log('Event Sending fail!', error);
    });

     // send response to client
     res.status(201).send(commentsByPostId[id]);
});

// Received event from events bus
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});