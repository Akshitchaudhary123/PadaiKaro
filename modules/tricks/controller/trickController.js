const Trick = require('./../model/tricksModel');
const {uploadOnCloudinary} = require('./../../../utils/cloudinary');
const validator = require("validator")

exports.createTrick=async(req,res)=>{
    // console.log("sdfghjk");

    try {
        let {subjectId,chapter,chapterName,title} = req.body;
    
        subjectId=subjectId?.trim();
        chapter = chapter?.trim();
        chapterName = chapterName?.trim();
        title = title?.trim();
        let file = req?.file?.path;
        console.log("fiile",file);
        if(!subjectId){
            return res.send({
                statusCode:400,
                success:false,
                message:"Subject Id is required",
                result:{}
            })
        }
        if(!chapter){
            return res.send({
                statusCode:400,
                success:false,
                message:"chapter is required",
                result:{}
            })
        }
        if(!chapterName){
            return res.send({
                statusCode:400,
                success:false,
                message:"chapter name is required",
                result:{}
            })
        }
    
        if(!file){
            return res.send({
                statusCode:400,
                success:false,
                message:"file is required",
                result:{}
            })
        }
        let fileSize = req.file.size;
        console.log("fileSize",fileSize);
        fileSize = (fileSize/1048576).toFixed(2);
        let fileUrl = await  uploadOnCloudinary(file);
    
        let trick = new Trick({
            subjectId,
            fileUrl,
            fileSize:Number.parseInt(fileSize),
            chapterName,
            chapter
        })
    
        await trick.save();
    
        return res.send({
            statusCode:200,
            success:true,
            message:"Trick saved successfully",
            result:{}
        })

    } catch (error) {
        console.log("error in saving trick",error);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{
                error:error.message
            }
        })
    }
}


exports.getTricks = async(req,res)=>{

    try {
        let subjectId = req.params;
    
        subjectId= subjectId?.trim();
    
        let isMongooseId = validator.isMongoId(subjectId);
    
        if(!isMongooseId){
    
            return res.send({
                statusCode:400,
                success:false,
                message:"subject id is not valid",
                result:{}
            })
        }
    
        let tricks = await Trick.find({subjectId:subjectId});
    
        if(tricks){
        return res.send({
            statusCode:200,
            success:true,
            message:"tricks fetched successfully",
            result:{
                tricks
            }
        })
    
        return res.send({
            statusCode:404,
            success:false,
            message:"No data found",
            result:{}
        })
    
    }
    
    } catch (error) {
        console.log("error in fetching tricks");
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error.message}
        })
    }

}