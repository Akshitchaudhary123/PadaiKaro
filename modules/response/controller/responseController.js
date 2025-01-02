const Response = require('./../model/responseModel');
const User = require('./../../user/model/userModel');
const RecentActivity = require('./../../recentActivity/model/recentActivityModel');

exports.saveResponse=async(req,res)=>{

    try {
        let{title,points,startTime,endTime,questionSolved,questionUnsolved,userId} = req.body;
        userId=userId?.trim().toLowerCase();
    
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
        if(!userId){
            return res.send({
                statusCode:400,
                success:false,
                message:"userId is required",
                result:{}
    
            })
        }
    
        let user = await User.findById(userId);
        if(!user){
            return res.send({
                statusCode:404,
                success:false,
                message:"user not found",
                result:{}
    
            })
        }
        let timeTaken = endTime-startTime;
        let response = new Response({
            points:points,timeTaken:timeTaken,questionSolved:questionSolved,questionUnsolved:questionUnsolved,user:user._id
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
        points = points.toString();
        let recentActivity = new RecentActivity({
            title:title,subtitle:points,icon:""
        });
    
        recentActivity = await recentActivity.save();
    
        if(!recentActivity){
            return res.send({
                statusCode:400,
                success:false,
                message:"failed to save recent activity",
                result:{}
    
            })
        }

        user = await User.findOneAndUpdate({userId},{
            $set:{
                recentActivity:recentActivity._id
            }
        })
     
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
            result:{}
    
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