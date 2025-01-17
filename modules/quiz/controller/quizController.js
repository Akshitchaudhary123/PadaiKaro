
const Quiz = require('./../model/quizModel');
const Response = require('./../../response/model/responseModel');
const Category = require('./../../categories/model/categoryModel');
const uploadOnCloudinary = require('./../../../utils/cloudinary').uploadOnCloudinary

// #DBEAFE for Jee
// #DCFCE7 for neet
// #F3E8FF for 12
// #FFEDD5 for 10

//10 
//6782c4f9fe25e1a7a87cf6d8

exports.createQuiz=async(req,res)=>{

    try {
        let {name,category,quizType,subject,level,points,questions}  = req.body;
        name=name?.trim();
        category=category?.trim();
        quizType=quizType?.trim();
        subject=subject?.trim();
        
        // console.log("subject: ",subject);


        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category is required",
                result:{}
            })
        }
        if(!quizType){
            return res.send({
                statusCode:404,
                success:false,
                message:"quizType is required",
                result:{}
            })
        }
        if(category==='10'||category==='12'){

            if(!subject){
                return res.send({
                    statusCode:404,
                    success:false,
                    message:"subject is required",
                    result:{}
                })
            }
        }
        
        if(questions.length==0){
            return res.send({
                statusCode:404,
                success:false,
                message:"Questions are required",
                result:{}
            })
        }

        let query={};
        if(name)query.name=name;
        if(category)query.category=category;
        if(quizType)query.quizType=quizType;
        if(level)query.level=level;
        if(subject)query.subject=subject;

        let isQuizExist = await Quiz.findOne(query);
        if(isQuizExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Quiz Already exist",
                result:{}
            })
        }
        questions = JSON.parse(questions);
        let quiz = new Quiz({
           name:name,category:category,quizType:quizType,level:level,subject:subject,points:points,questions:questions
        })

        quiz = await quiz.save();

        if(!quiz){
            return res.send({
                statusCode:400,
                success:false,
                message:"Failed to create Quiz",
                result:{}
            })
        }

        return res.send({
            statusCode:200,
            success:true,
            message:"Quiz created successfully",
            result:{
                quiz:quiz
                // questions:questions
            }
        })
    
    } catch (error) {
        console.log(`error in creating quiz ${error}`);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error}
        })
        
    }
}

exports.updateQuiz=async(req,res)=>{

    try {
        let {category,quizType,subject,level,points,questions}  = req.body;
        category=category?.trim().toLowerCase();
        quizType=quizType?.trim().toLowerCase();
        subject=subject?.trim().toLowerCase();
        
        // console.log("subject: ",subject);


        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category is required",
                result:{}
            })
        }
        if(!quizType){
            return res.send({
                statusCode:404,
                success:false,
                message:"quizType is required",
                result:{}
            })
        }
        if(category==='10'||category==='12'){

            if(!subject){
                return res.send({
                    statusCode:404,
                    success:false,
                    message:"subject is required",
                    result:{}
                })
            }
        }
        
        if(questions.length==0){
            return res.send({
                statusCode:404,
                success:false,
                message:"Questions are required",
                result:{}
            })
        }

        let query={};
        if(category)query.category=category;
        if(quizType)query.quizType=quizType;
        if(level)query.level=level;
        if(subject)query.subject=subject;

        let isQuizExist = await Quiz.findOne(query);
        if(!isQuizExist){
            return res.send({
                statusCode:404,
                success:false,
                message:"Quiz Not Found",
                result:{}
            })
        }

        let quiz = await Quiz.findOneAndUpdate(query,{
            $set:{
                // category:category??quiz.category,
                // quizType:quizType??quiz.quizType,
                // subject:subject??quiz.subject,
                level:level??quiz.level,
                points:points??quiz.points,
                questions:questions??quiz.questions,
            }
        },{new:true})

        if(!quiz){
            return res.send({
                statusCode:400,
                success:false,
                message:"Failed to update Quiz",
                result:{}
            })
        }

        return res.send({
            statusCode:200,
            success:true,
            message:"Quiz updated successfully",
            result:{
                quiz:quiz
                // questions:questions
            }
        })
    
    } catch (error) {
        console.log(`error in updating quiz ${error}`);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error}
        })
        
    }
}

exports.getQuiz= async(req,res)=>{

    try {
        let quizId = req.params.quizId;
    
        if(!quizId){
            return res.send({
                statusCode:404,
                success:false,
                message:"Quiz Id is required",
                result:{}
            })
        }
    
        let quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.send({
                statusCode:404,
                success:false,
                message:"Quiz not found",
                result:{}
            })
        }
    
        let questions = quiz.questions;
        if(!questions){
            return res.send({
                statusCode:404,
                success:false,
                message:"Questions not found",
                result:{}
            })
        }
       
        return res.send({
            statusCode:200,
            success:true,
            message:"Quiz fetched successfully",
            result:{
                questions:questions
            }
        })
    
    } catch (error) {
        console.log("error in fetching questions",error);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{}
        })
    }
}

exports.quizCategories = async(req,res)=>{

   try {
     
    const data = await Category.aggregate([
        {
          $lookup: {
            from: "quizzes", // The name of the Quiz collection
            localField: "_id", // Field from the Category collection
            foreignField: "category", // Field from the Quiz collection
            as: "quizzes" // The name of the field to store matched quizzes
          }
        },
        {
          $addFields: {
            quizCount: { $size: "$quizzes" } // Add a field `quizCount` with the number of quizzes
          }
        },
        {
          $project: {
            _id: 1,
            title:1,
            subTitle:1,
            class:1, // Include only `_id`
            quizCount: 1, // Include only `quizCount`
            color: 1,
            icon: 1,

          }
        }
      ]);
      
      console.log(data);
            

     res.send({
         statusCode:200,
         success:true,
         message:"quizes fetched successfully",
         result:{
             data:data
         }
     })
   } catch (error) {
    console.log("error in quizCategories",error);
    res.send({
        statusCode:500,
        success:false,
        message:"Internal Server Error",
        result:{}
    })

   }


}

exports.quizCategoriesLevels = async(req,res)=>{

    try{
        let userId = req.token._id;
        let categoryId = req.params.categoryId;


      let quiz = await Quiz.findById(categoryId);
    //   let quizCategory = quiz.category;
    //   console.log("quizCategory",quizCategory);
      let quizLevels = await Quiz.find({'category':categoryId}).select('_id name level points');
      console.log("quizLevels",quizLevels);

      let quizLevelIds = [];
      for(let i=0;i<quizLevels.length;i++){
        quizLevelIds.push(quizLevels[i]._id);
      }

      let scores = await Response.find({quiz:{'$in':quizLevelIds},user:userId}).select('quiz score');

      console.log("quizLevelIds",quizLevelIds);
      quizLevels.forEach(level=>{
        let score = scores.find(score=>score.quiz.toString()===level._id.toString());
        level.score =score?score.score:0;

      })
  
      res.send({
          statusCode:200,
          success:true,
          message:"quiz levels fetched successfully",
          result:{
             quizLevels 
          }
      })
    } catch (error) {
     console.log("error in quizCategoriesLevels",error);
     res.send({
         statusCode:500,
         success:false,
         message:"Internal Server Error",
         result:{error:error.message}
     })
 
    }
 
 
 }

 exports.createContest=async(req,res)=>{

    try {
        let {name,category,subject,points,questions}  = req.body;
        name=name?.trim().toLowerCase();
        category=category?.trim().toLowerCase();
        quizType=quizType?.trim().toLowerCase();
        subject=subject?.trim().toLowerCase();
        
        // console.log("subject: ",subject);

        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category is required",
                result:{}
            })
        }
        if(!quizType){
            return res.send({
                statusCode:404,
                success:false,
                message:"quizType is required",
                result:{}
            })
        }
        if(category==='10'||category==='12'){

            if(!subject){
                return res.send({
                    statusCode:404,
                    success:false,
                    message:"subject is required",
                    result:{}
                })
            }
        }
        let color="";
        if(category==='10'){
          color='FFEDD5';
        }
        else if(category==='12'){
            color = 'F3E8FF';
        }
        else if(category==='jee'){
            color = 'DBEAFE';
        }
        else{
          // for neet
          color = 'DCFCE7'
        }
        
        if(questions.length==0){
            return res.send({
                statusCode:404,
                success:false,
                message:"Questions are required",
                result:{}
            })
        }

        let query={};
        if(name)query.name=name;
        if(category)query.category=category;
        if(quizType)query.quizType=quizType;
        if(level)query.level=level;
        if(subject)query.subject=subject;

        let isQuizExist = await Quiz.findOne(query);
        if(isQuizExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Quiz Already exist",
                result:{}
            })
        }
        questions = JSON.parse(questions);
        const fileUrl = await uploadOnCloudinary(req.file.path);
        let quiz = new Quiz({
           name:name,icon:fileUrl,color:color,category:category,quizType:quizType,level:level,subject:subject,points:points,questions:questions
        })

        quiz = await quiz.save();

        if(!quiz){
            return res.send({
                statusCode:400,
                success:false,
                message:"Failed to create Quiz",
                result:{}
            })
        }

        return res.send({
            statusCode:200,
            success:true,
            message:"Quiz created successfully",
            result:{
                quiz:quiz
                // questions:questions
            }
        })
    
    } catch (error) {
        console.log(`error in creating quiz ${error}`);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error}
        })
        
    }
}