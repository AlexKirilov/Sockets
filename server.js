const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const stellarAge = require('./stellarAge/stellarAge');

// const app = express();
const PORT = process.env.PORT || 3000;
const server = express().listen(PORT, () => console.log(`Listening on ${PORT}`));
const {
    Server
} = require('ws');
const wss = new Server({
    server
});

// app.use(cors());
// app.use(bodyParser.json());
// app.use('/stellar-age', stellarAge);

// app.listen(process.env.PORT || 3000, (d) => console.log('app => ', d));

function getChatData(chat, socket) {
    chat.find().limit(50).sort({
        _id: 1
    }).toArray((err, res) => {
        if (err) {
            throw err;
        }
        socket.send(JSON.stringify({
            type: 'getAllMessages',
            messages: res
        }));
    });
}

mongoose.connect('mongodb://studentapitest:studentapitestadmin@ds119080.mlab.com:19080/studentapi', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, db) => {
    if (!err) console.log('connected to mongo');
    else console.log(' Mongo connection issue => ', err);

    wss.on('connection', (socket) => {
        const chat = db.collection('chat');

        getChatData(chat, socket);

        socket.on('message', function incoming(response) {
            const data = JSON.parse(response);

            if (data.type === 'input') {
                chat.insertOne(data.message, () => {
                    getChatData(chat, socket);
                });
            } else if (data.type === 'getAllMessages') {
                getChatData(chat, socket);
            } else if (data.type === 'updateFleets') {
                socket.send(JSON.stringify({ type: 'updateFleets' }));
            } else if (data.type === 'startRally') {
                socket.send(JSON.stringify({ type: 'startRally' }));
            }
        });

        socket.on("close", function() {
            console.log("websocket connection close")
                // clearInterval(id)
        });

        // setInterval(() => {
        //     wss.clients.forEach((client) => {
        //         client.send();
        //     });
        // }, 1000);
    });
});

// // http.listen(4567);

// var server = http.createServer(app)
// server.listen(port)

// console.log("http server listening on %d", port)

// var wss = new WebSocketServer({
//     server: server,
//     origins: allowedOrigins
// })
// console.log("websocket server created")