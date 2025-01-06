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

        let quizAdded =0;
    
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
        // console.log("time taken type is:",typeof(timeTaken));

        let quiz = await Quiz.findById(quizId);
        // let quizTotalPoints= quiz.points;
        // console.log("quizTotalPoints",quizTotalPoints);
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
        console.log("percentage:",percentage);
        let medal="";

        if(percentage>90&&percentage<=100){
           medal="Expert"
        }
        else if(percentage>80&&percentage<=90){
            medal="Gold"
        }
        else if(percentage>70&&percentage<=80){
            medal="Silver"
        }
        else{
            medal="Bronze"
        }

        let prevPoints=0;
        let existResponse = await Response.findOne({quiz:quizId});
        let response;
        if(existResponse){
            prevPoints = existResponse.points;
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
            quizAdded=1;
            if(!response){
                return res.send({
                    statusCode:400,
                    success:false,
                    message:"failed to save response",
                    result:{}
        
                })
            }
        }
        let subject = quiz.subject;
        if(!subject){
          subject = quiz.category;
        }

        let recentActivity = new RecentActivity({
            title: subject,
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
        let user = await User.findById(_id);
        console.log("user quizzes Count",user.quizCount);
        let newPoints = points - prevPoints;
        let userTotalPoints=user.points;
        let quizTotalMaxPoints = user.quizPointsCount;
        userTotalPoints +=newPoints;
        let quizCount = user.quizCount;
        if(quizAdded!=0){
         quizTotalMaxPoints += quizPoints;
         quizCount+=quizAdded
        }
        let accuracy = (userTotalPoints/quizTotalMaxPoints)*100;
        accuracy = Math.ceil(accuracy);
        console.log("accuracy",accuracy);

         user = await User.findOneAndUpdate({_id},{
            $set:{
                points:userTotalPoints,
                quizPointsCount:quizTotalMaxPoints,
                quizCount:quizCount,
                accuracy:accuracy,
                recentActivity:recentActivity._id
            }
        },{new:true}).populate('recentActivity')
     
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
                user:user

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
        let medal  = req.params.medal;
        // console.log("medal",medal);
        let userId = req.token._id;
        if(!medal){
            return res.send({
                statusCode:400,
                success:false,
                message:"Medal is required",
                result:{}
    
            })
        }
        
        let responses = await Response.find({medal:medal,user:userId}).sort({points:-1}).populate({
            path:'quiz',select:'-questions'
        });
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