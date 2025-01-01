
const Quiz = require('./../model/quizModel');


exports.createQuiz=async(req,res)=>{

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
        if(isQuizExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Quiz Already exist",
                result:{}
            })
        }

        let quiz = new Quiz({
            category:category,quizType:quizType,level:level,subject:subject,points:points,questions:questions
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


