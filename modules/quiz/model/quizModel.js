const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  name:{
    type:String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  quizType: {
    type: String,
    enum: ['practice', 'contest'],
    required: true,
  },
  subject:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Subject",
   
  },
  startTime:{
   type:Date,
   required:function(){
    return (this.quizType==='contest')
   }
  },
  level: {
    type: Number,
    default:1,
    required:function(){
      return (this.quizType==='practice')
     },
  },
  
  points: {
    type: Number, 
    required: true,
    default:0
  },
  score:{
    type:Number,
    default:0,
  },
  unlocked:{
    type:Boolean,
    default:function(){
      if(this.level===1){
        return true;
      }
      return false;
    }
  },
  questions:[{
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    options: [
        {
           number:{
            type:Number
           },
           value:{
            type:String,
            default:""
           }
        }
    ],
    
},
]
    

  
 
},{timestamps:true});



const Quiz = mongoose.model('Quiz', quizSchema);
module.exports=Quiz;
