const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false, 
    },
    category: {
        type: String,
        enum: ['school', 'college'],
        required: true,
        default:'school'
    },
    class: {
        type: String,
        required: function () {
            return this.category === 'school'; // Required for school notes
        },
    },
    semester: {
        type: String,
        required: function () {
            return this.category === 'college'; // Required for B.Tech notes
        },
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject", 
    },
    chapter:{
        type:String,
        required:function(){
            return this.type==='notes'
        },
        default:""
    },
    chapterName:{
        type:String,
        required:function(){
            return this.chapter!==0
        }
    },
    type: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true, 
    },
    fileSize:{
        type:Number,
        required:true,
        default:0
    }
    
},{timestamps:true});

module.exports = mongoose.model('Notes', notesSchema);
