const mongoose = require('mongoose');


const recipeHistorySchema =  new mongoose.Schema({
    username : {
        type: String,
        required: true
    },

    recipe: {
        type: String,
        required: true,
     }
 });

module.exports = Recipemodel = mongoose.model('History',recipeHistorySchema);