const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const stellarAge = require('./stellarAge/stellarAge');
// const app = express();
// const http = require('https');
// const server = http.createServer(app);
// const io = require('socket.io').listen(server);

///////////////////////////////////////////////
var WebSocketServer = require("ws").Server
var http = require("http")
var app = express()
var port = process.env.PORT || 4567
var allowedOrigins = "*:*";


//////////////////////////////////////////
mongoose.Promise = Promise;

app.set('port', port);
app.use(cors());
app.use(bodyParser.json());
app.use('/stellar-age', stellarAge);

mongoose.connect('mongodb://studentapitest:studentapitestadmin@ds119080.mlab.com:19080/studentapi', { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (!err) console.log('connected to mongo');
    else console.log(' Mongo connection issue => ', err);

    wss.on('connection', (socket) => {
        let chat = db.collection('chat');

        var id = setInterval(function() {
            socket.send(JSON.stringify(new Date()), function() {})
        }, 1000)

        // create func to send status
        sendStatus = (s) => {
            socket.emit('status', s);
        }

        chat.find().limit(50).sort({ _id: 1 }).toArray((err, res) => {
            if (err) { throw err; }
            socket.emit('output', res);
        });

        socket.on('input', (data) => {
            chat.insertOne(data, () => {
                wss.emit('output', data);

                sendStatus({
                    message: 'Message send',
                    clear: true
                })
            });
        });

        socket.on('clear', (data) => {
            chat.deleteMany({}, () => {
                socket.emit('cleared');
            })
        })

        socket.on("close", function() {
            console.log("websocket connection close")
            clearInterval(id)
        })
    });
});

// http.listen(4567);

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({ server: server, origins: allowedOrigins })
console.log("websocket server created")