const Response = require('./../model/responseModel');
const User = require('./../../user/model/userModel');
const RecentActivity = require('./../../recentActivity/model/recentActivityModel');
const Quiz = require('../../quiz/model/quizModel');

exports.saveResponse=async(req,res)=>{

    try {
        let{title,points,startTime,endTime,questionSolved,questionUnsolved,quizId} = req.body;
        let {_id}= req.token;
        // console.log("_id",_id);
        // console.log("type of _id is:",typeof(_id));
    
        if(!points){
            return res.send({
                statusCode:400,
                success:false,
                message:"Points is required",
                result:{}
    
            })
        }
        if(!startTime){
            return res.send({
                statusCode:400,
                success:false,
                message:"startTime is required",
                result:{}
    
            })
        }
        if(!endTime){
            return res.send({
                statusCode:400,
                success:false,
                message:"endTime is required",
                result:{}
    
            })
        }
        if(!questionSolved){
            return res.send({
                statusCode:400,
                success:false,
                message:"questionSolved is required",
                result:{}
    
            })
        }
        if(!questionUnsolved){
            return res.send({
                statusCode:400,
                success:false,
                message:"questionUnsolved is required",
                result:{}
    
            })
        }
        if(!quizId){
            return res.send({
                statusCode:400,
                success:false,
                message:"quiz id is required",
                result:{}
    
            })
        }
        const startTimeParsed = new Date(startTime).getTime();
        const endTimeParsed = new Date(endTime).getTime();
        
        let timeTaken = endTimeParsed-startTimeParsed;
        console.log("time taken type is:",typeof(timeTaken));

        let quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.send({
                statusCode:404,
                success:false,
                message:"quiz not found",
                result:{}
    
            })
        }
        let quizPoints = quiz.points;
        let percentage = (points/quizPoints)*100;
        let medal="";

        if(90<percentage<=100){
           medal="Expert"
        }
        else if(80<percentage<=90){
            medal="Gold"
        }
        else if(70<percentage<=80){
            medal="Silver"
        }
        else{
            medal="Bronze"
        }


        let existResponse = await Response.findOne({quiz:quizId});
        let response;
        if(existResponse){
          
            response = await Response.findOneAndUpdate({quiz:quizId},{
                $set:{
                    points:points,timeTaken:timeTaken,questionSolved:questionSolved,
                    questionUnsolved:questionUnsolved,medal:medal
                }
            },{new:true})

        }
        else{

             response = new Response({
                points:points,timeTaken:timeTaken,questionSolved:questionSolved,questionUnsolved:questionUnsolved,
                user:_id,quiz:quizId,medal:medal
            });
    
            response = await response.save();
            if(!response){
                return res.send({
                    statusCode:400,
                    success:false,
                    message:"failed to save response",
                    result:{}
        
                })
            }
        }
        
        let recentActivity = new RecentActivity({
            title: "Quiz Completed",
            subTitle: {
                "points": points,
                "medal": medal
            },
            icon: ""
        }
        );
    
        recentActivity = await recentActivity.save();
    
        if(!recentActivity){
            return res.send({
                statusCode:400,
                success:false,
                message:"failed to save recent activity",
                result:{}
    
            })
        }

       let user = await User.findOneAndUpdate({_id},{
            $set:{
                recentActivity:recentActivity._id
            }
        }).populate('recentActivity')
     
        if(!user){
            return res.send({
                statusCode:400,
                success:false,
                message:"Failed to update User",
                result:{}
        
            })
        }

        return res.send({
            statusCode:200,
            success:true,
            message:"Response saved successfully",
            result:{
                quizResponse:response,
                // user:user

            }
    
        })
    
    } catch (error) {
        console.log("error in saving response",error);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{
                error:error
            }

        })
        
    }

}

exports.getAchievementsQuiz= async(req,res)=>{

    try {
        let {medal,userId}  = req.params;
        if(!medal){
            return res.send({
                statusCode:400,
                success:false,
                message:"Medal is required",
                result:{}
    
            })
        }
        if(!userId){
            return res.send({
                statusCode:400,
                success:false,
                message:"User Id is required",
                result:{}
    
            })
        }
    
        let responses = await Response.find({medal:medal},{user:userId}).sort({points:-1}).populate('quiz');
        if(!responses){
            return res.send({
                statusCode:400,
                success:false,
                message:`Failed to find ${medal} Quizzes`,
                result:{}
    
            })
        }
    
        return res.send({
            statusCode:200,
            success:true,
            message:`${medal} Quizzes fetched successfully`,
            result:{
                Quizzes:responses
            }
    
        })
    } catch (error) {
        console.log("error in fetching Achievements Quiz",error);
        return res.send({
            statusCode:500,
            success:false,
            message:`Internal Server Error`,
            result:{}
    
        })
    }

}