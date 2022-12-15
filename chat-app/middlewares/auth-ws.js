const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authWs = async (token) => {
    const [username, password] = Buffer.from(token, 'base64').toString().split(':');
    
    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);

    try {
        let
        user = await User.findOne({
            username: username
        })
        if (!user) {
            return { message: 'Unauthorized' };
        } else if (bcrypt.compareSync(password, user.password)) {
            return {user};
        } else {
            return { message: 'Unauthorized' };
        }
    } catch (err) {
        console.log(err);
        return { message: err.message };
    }
}

module.exports = authWs;