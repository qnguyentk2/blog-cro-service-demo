const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json()); // use to get data from req.body from client
app.use(cors());

// posts Data Mockup
const posts = {};

// app.get('/posts', (req, res) => {
//     // send data to client
//     res.send(posts);
// });

app.post('/posts', async (req, res) => {
     // create a random ID with 4 bytes and in hex string
     const id = randomBytes(4).toString('hex');

     // get data from req body from client
     const { title } = req.body;

    console.log(req.body);

    const newPost = {
        id, title
    }

    // console.log(newPost)

    // update newPost to database of service post
    posts[id] = newPost;

    // send event to events bus to create a new post
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: newPost
    }).catch(error => {
        console.log('Event Sending fail!', error);
    });

     // send response to client
    res.status(201).send(posts[id]);
});

// Received event from events bus
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});
