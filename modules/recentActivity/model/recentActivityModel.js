const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        points:{
            type:Number,
            default:0
        },
        medal:{
            type:String,
            enum:["Gold","Silver","Bronze","Expert"],
            default:""
        }
    },
    icon:{
        type:String,
        default:""
        // required:true
    }
},{timestamps:true});

const Activity = mongoose.model('Activity',activitySchema);
module.exports=Activity;