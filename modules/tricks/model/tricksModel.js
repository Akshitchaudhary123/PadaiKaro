const mongoose = require("mongoose");

const trickSchema =new mongoose.Schema({
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject"
    },
    title:{
        type:String,
        default:""
    },
    chapter:{
        type:Number,
        default:0
    },
    chapterName:{
        type:String,
        default:""
       
    },
    fileUrl:{
        type:String,
        default:""

    },
    fileSize:{
        type:Number,
        default:""

    },

},{timestamps:true});

const Trick = mongoose.model("Trick",trickSchema);

module.exports = Trick;