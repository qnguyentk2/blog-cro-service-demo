const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json()); // use to get data from req.body from client
app.use(cors());

// send events 
app.post('/events', (req, res) => {
    const event = req.body;
    console.log('event: ', event);

    // send event to service posts
    axios.post('http://localhost:4000/events', event).catch(error => {
        console.log('Event Sending to Service posts fail!', error);
    });;
    // send event to service comments
    axios.post('http://localhost:4001/events', event).catch(error => {
        console.log('Event Sending to service comments fail!', error);
    });;
    // send event to service query
    axios.post('http://localhost:4002/events', event).catch(error => {
        console.log('Event Sending to service query fail!', error);
    });;

    res.send({ status: 'OK' });
});

app.listen(4005, () => {
    console.log('Listening on 4005');
});
