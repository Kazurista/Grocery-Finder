
const express = require('express');
const request = require('request');
const config = require('./config.json')
const app = express();
const httpRequest = require('./httpRequest');
const mongoose = require('mongoose');
const User = require('./user');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://admin:ntMpb3yLMRHIRYxO@cluster0.xkcpi.mongodb.net/userDb?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true
})



//authentication

const authenticate = (req,res, next) => {
    if (req.headers[config.authentication.headerName] !== config.authentication.key) {
        res.status(401).send();
        return;
    }
    next();
};


//get request to get Recipie Catagory 
app.get('/api/recipie-catagory-list',authenticate, (req,res) =>{
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
app.get('/api/recipie-catagory-ranking',authenticate, (req,res) =>{
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
app.get('/api/item-search',authenticate, (req,res) =>{
    httpRequest.getItem()
    .then(itemList => {
        res.send(itemList)
    })
    .catch(err => {
        console.log(err);
        res.status(500).send();
    });
});


app.post('/api/user',(req,res)=>{
    const username = req.body ? req.body.username : null;
    const password = req.body? req.body.password : null;
    
    
   const user = new User({
    _id : new mongoose.Types.ObjectId(),
    username: username,
    password : password
    
   });


   user
   .save()
   .then(result =>{
       console.log(result);
   })
   .catch(err => console.log(err));
   res.status(201).json({
       message : 'Handling Post requests to / User',
       createProduct: user
   });



});

const port = process.env.PORT || config.app.port ;

app.listen(port, () => console.log(`listening on port ${port} ... `));

