const mongoose = require('mongoose');
const express = require('express');
const Recipemodel = require('./models/recipe');
const route = express.Router();

route.post('/', async(req,res)=>{
    const {username, recipeHistory} = req.body;
    let recipe = {};
    recipe.username = username;
    //const finalresult = func().then(value=>{
    //    return value;
    //});
    try{
        const finalresult = await Recipemodel.find(recipe)                          // find recipe start
                        .exec()
                        .then(recipeResult =>{                                  
                            return new Promise((resolve, reject)=>{
                            if (recipeResult.length !=0){                           // save all the recipe histories of one user in an array
                                var recipeArray = new Array();
                                for (var i = 0; i<recipeResult.length; i ++){
                                    recipeArray[i] = recipeResult[i].recipe;
                                }
                                var finalrecipe = new Set(recipeArray);            // filter the same history data.
                                resolve(finalrecipe);
                                recipeArray = Array.from(finalrecipe);
                                res.status(200).json(recipeArray);
                                }
                                else{                                             // cannot find history = new user
                                 res.json("It is your first time to log in our page. Welcome.")
                                }
                         })
                         .catch(err=>{
                            console.log(err);
                        });
                     });
    console.log(finalresult);
    } catch(err) {
        console.log(err);
    }
    });

module.exports = route;