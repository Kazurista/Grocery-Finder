
const express = require('express');
const request = require('request');
const config = require('./config.json')
const app = express();
const httpRequest = require('./httpRequest');
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const UserController = require('./controllers/user');
const bcrypt = require('bcrypt');


mongoose.connect('mongodb+srv://admin:ntMpb3yLMRHIRYxO@cluster0.xkcpi.mongodb.net/userDb?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})



//authentication

const authenticate = (req, res, next) => {
    if (req.headers[config.authentication.headerName] !== config.authentication.key) {
        res.status(401).send();
        return;
    }
    next();
};

//get request to get Recipie Catagory 
app.get('/api/recipie-catagory-list', authenticate, (req, res) => {
    httpRequest.getRecipieCatagoryList()

        .then(recipieCatagoryList => {
            res.send(recipieCatagoryList)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});


//get request to get Recipie Catagory Ranking
app.get('/api/recipie-catagory-ranking', authenticate, (req, res) => {
    httpRequest.getRecipieCatagoryRanking()

        .then(recipieCatagoryRanking => {
            res.send(recipieCatagoryRanking)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});

//get request to search item on Rakuten Ichiba
app.get('/api/item-search', authenticate, (req, res) => {
    httpRequest.getItem()
        .then(itemList => {
            res.send(itemList)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send();
        });
});


app.post('/api/user', (req, res) => {
    const username = req.body ? req.body.username : null;
    const password = req.body ? req.body.password : null;


    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        password: password

    });


    user
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling Post requests to / User',
        createProduct: user
    });



});

app.post('/api/user/signup', (req, res, next) => {
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
});


app.post('/api/user/login', (req, res, next) => {
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
});


const port = process.env.PORT || config.app.port;

app.listen(port, () => console.log(`listening on port ${port} ... `));

