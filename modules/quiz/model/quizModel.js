const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  type: {
    type: String,
    // enum: ['gold', 'silver', 'bronze', 'expert'],
    required: true,
  },
  timeTaken: {
    type: String, 
    required: true,
    default:"0"
  },
  points: {
    type: String, 
    required: true,
    default:"0"
  },
  accuracy: {
    type: String, 
    required: true,
    default:"0"
  },
  questionsSolved: {
    type: String, 
    required: true,
    default:"0"
  },
  questionsUnsolved: {
    type: String, 
    required: true,
    default:"0"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
 
},{timestamps:true});



const Quiz = mongoose.model('Quiz', quizSchema);
module.exports=Quiz;
