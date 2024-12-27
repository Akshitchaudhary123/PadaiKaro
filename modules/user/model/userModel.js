const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    school:{
        type:String,
        trim:true
    
    },
    education:{
        type:String,
        trim:true
        
    },
    preparingFor:{
        type:String,
        trim:true
    },
    password:{
        
        type:String,
        required:true
    },
    status:{
      type:String,
      enum: ["Active","Inactive"],
      default:"Active"
    },
    authorised:{
      type:Boolean,
      default:false
    },
    otpExpireTime:{
        type:Date,
        default:Date.now()

    },
    otp:{
        type:String,
        default:""
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports=User;