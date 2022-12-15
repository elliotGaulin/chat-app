const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const authWs = require('../middlewares/auth-ws');

router.get('/', auth, async (req, res, next) => {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);
    try {
        const messages = await Message.find({ $or: [{ sender: req.user._id }, { receiver: req.user._id }] });
        res.json(messages);
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    } finally {
        await mongoose.disconnect();
    }
});

router.get('/conversations', auth, async (req, res, next) => {

    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);

    const userId = mongoose.Types.ObjectId(req.user._id);
    try {
        let conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { receiver: userId }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            {
                                $eq: ["$sender", userId]
                            },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: {
                        $last: "$$ROOT"
                    },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                },
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    user: {
                        _id: 1,
                        username: 1,
                    },
                }
            },
            {
                $sort: {
                    "lastMessage.date": -1
                }
            }
        ]);

        res.json({ conversations: conversations });
    } catch (err) {
        res.json({ message: err.message }, 500);
    } finally {
        await mongoose.disconnect();
    }
});

router.get('/conversations/:otherUserid', auth, async (req, res, next) => {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);
    const userId = mongoose.Types.ObjectId(req.user._id);

    try {
        let messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId, receiver: mongoose.Types.ObjectId(req.params.otherUserid) },
                        { sender: mongoose.Types.ObjectId(req.params.otherUserid), receiver: userId }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender"
                },
            },
            {
                $unwind: "$sender"
            },
            {
                $project: {
                    _id: 1,
                    message: 1,
                    date: 1,
                    sender: {
                        _id: 1,
                        username: 1,
                    },
                }
            },
        ]);

        res.json({ messages: messages });
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    } finally {
        await mongoose.disconnect();
    }
});

router.post('/', auth, async (req, res, next) => {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);

    try {
        let message = new Message(req.body);
        message.date = new Date();
        message.sender = req.user._id;
        const newMessage = await message.save();
        res.json(newMessage);
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    } finally {
        await mongoose.disconnect();
    }
});



module.exports = router;

