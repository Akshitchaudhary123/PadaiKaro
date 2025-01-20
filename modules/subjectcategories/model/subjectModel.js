const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    class:{
        type:String,
        // required:true
    }

},{timestamps:true})

const Subject = mongoose.model("Subject",subjectSchema);
module.exports= Subject