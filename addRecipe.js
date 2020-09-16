const mongoose = require('mongoose');
const express = require('express');
const Recipemodel = require('./models/recipe');
const route = express.Router();

route.post('/', async(req,res)=>{
    const{username, recipeName} = req.body;
    let recipe = {};                    //set the template of insert
    recipe.username = username;
    recipe.recipe = recipeName;
    let recipemodel = new Recipemodel(recipe);
    try{
        await recipemodel.save();       //try insert
        res.json("Saved Successfully!")
        console.log("Saved Successfully!");
    } catch(err){
        console.log("Error!");
    }
});

module.exports = route;