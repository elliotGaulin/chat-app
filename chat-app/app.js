var express = require('express');
var app = express();
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Message = require('./models/Message');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');
const authWs = require('./middlewares/auth-ws');
const { json } = require('express');
const User = require('./models/User');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', async function connection(ws, req) {
    ws.firstMessage = true;

    ws.on('message', async (message) => {
        if (ws.firstMessage) {
            ws.firstMessage = false;
            let data = await JSON.parse(message);
            let authRes = await authWs(data.token);
            if (authRes.message) {
                ws.send(JSON.stringify(authRes));
                ws.close();
            }
            ws.user = authRes.user;
        }

        let data = await JSON.parse(message);
        console.log('received: %s', data);

        await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);

        try {
            let message = new Message(data);
            message.date = new Date();
            message.sender = ws.user._id;
            const newMessage = await message.save();
            let responseMessage = {
                _id : newMessage._id,
                message : newMessage.message,
                sender : await User.findById(ws.user._id, { _id: 1, username: 1}),
                receiver : await User.findById(data.receiver, { _id: 1, username: 1}),
                date : newMessage.date,
            }
            ws.send(JSON.stringify(responseMessage));

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN && client.user._id.toString() == newMessage.receiver.toString()) {
                    client.send(JSON.stringify(responseMessage));
                }
            });
        } catch (err) {
            console.log(err);
            ws.send(JSON.stringify({ message: err.message }));
        } finally {
            await mongoose.disconnect();
        }
    });
});


module.exports = app;
