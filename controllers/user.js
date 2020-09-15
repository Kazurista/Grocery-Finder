const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config.json');

exports.user_signup = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                console.log('Username unavailable');
                return res.status(409).json({
                    message: 'Username unavailable'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });

            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}


exports.user_login = (req, res, next) => {
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password)
                .then(result => {
                    if (result) {
                        const token = jwt.sign({
                            username: user[0].username,
                            userId: user[0]._id
                        },
                            config.authentication.key,
                            {
                                expiresIn: '30m'
                            });
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Auth failed',
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}