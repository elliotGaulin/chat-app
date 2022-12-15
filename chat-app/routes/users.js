require('dotenv').config();

const bcrypt = require('bcrypt');
var express = require('express');
const { mongoose } = require('mongoose');
var router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

/* GET users listing. */
router.post('/signup', async function (req, res, next) {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);
    try {
        let user = new User(req.body);
        user.password = bcrypt.hashSync(user.password, 10);
        const newUser = await user.save();
        res.json(newUser);
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    }finally{
        await mongoose.disconnect();
    }
});

router.post('/login', async function (req, res, next) {
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);
    try {
        let user = await User.findOne({ username : req.body.username })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else if (bcrypt.compareSync(req.body.password, user.password)) {
            res.json({"user": user});
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    }finally{
        await mongoose.disconnect();
    }
});

router.get('/', auth, async function (req, res, next) {
    return res.json({user: req.user});
});


module.exports = router;
