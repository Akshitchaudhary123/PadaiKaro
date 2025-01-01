const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['gold', 'silver', 'bronze', 'expert'],
    required: true,
  },
  points: {
    type: String,
    default: "0",
  },
  accuracy: {
    type: String, 
    default: "0",
  },
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Quiz', 
      required: true,
    },
  ],
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', 
  //   required: true,
  // },
}, { timestamps: true }); 

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
