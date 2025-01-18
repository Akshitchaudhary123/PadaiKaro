const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({

    timeTaken:{
        type:Number,
        required:true
    },
    score:{
        type:Number,
        required:true
    },
    questionSolved:{
        type:Number,
        required:true
    },
    questionUnsolved:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quiz:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Quiz"
    },
    medal:{
        type:String,
        required:true,
        default:""
    }
    
},{timestamps:true})

const Response= mongoose.model('Response',responseSchema);
module.exports= Response;