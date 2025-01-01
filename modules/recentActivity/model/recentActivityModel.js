const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    }
},{timestamps:true});

const Activity = mongoose.model('Activity',activitySchema);
module.exports=Activity;