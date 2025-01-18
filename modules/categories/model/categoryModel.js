const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    icon:{
        type:String
    },
    color:{
        type:String
    }
    

    
},{timestamps:true})

const Category = mongoose.model('Category',categorySchema);
module.exports = Category;