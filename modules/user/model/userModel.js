
const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    fcmToken:{
        type:String,
    },
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
      enum: ["Active","Delete"],
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
    },
    profileUrl:{
     type:String,
     default:""
    },
    quizCount:{
        type:Number,
        default:0 
    },
    accuracy:{
        type:Number,
        default:0
    },
    points:{
        type:Number,
        default:0
    },
    quizPointsCount:{
        type:Number,
        default:0
    },
   recentActivity:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Activity'
    }
   ],
   interests:[
    {
        type:String
    }
   ],
   bio:{
    type:String,
    trim:true
   },
   category:{
     type:String,
     enum:["school","collesge"],
     default:"school"
   }

},{timestamps:true});

const User = mongoose.model('User',userSchema);
module.exports=User;