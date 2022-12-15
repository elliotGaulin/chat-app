const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Middleware d'authentification pour les requetes HTTP
 * @param {*} req : La requete HTTP
 * @param {*} res : Le reponse HTTP
 * @param {*} next : La fonction suivante
 */

const auth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const [authType, authString] = authorization.split(' ');
    if (authType !== 'Basic') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const [username, password] = Buffer.from(authString, 'base64').toString().split(':');

    await mongoose.connect(process.env.MONGO_URI + "/" + process.env.MONGO_DBNAME);
    
    try {

        let user = await User.findOne({ username: username })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else if (bcrypt.compareSync(password, user.password)) {
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        console.log(err);
        res.json({ message: err.message });
    }
}

module.exports = auth;