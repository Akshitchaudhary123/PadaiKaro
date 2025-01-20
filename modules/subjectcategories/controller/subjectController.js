const Subject = require('./../model/subjectModel');
const {uploadOnCloudinary} = require('./../../../utils/cloudinary');

exports.createSubject = async(req,res)=>{

    try {
        let{name,color} = req.body;
        name=name?.trim();
        // Class=Class?.trim();
        color=color?.trim();

        // Name = req.body.Name;
        console.log("Name",name);
        // console.log("Class",class);
    
        if(!name|| !color ){
            return res.send({
                statusCode:400,
                success:false,
                message:"All fields are required",
                result:{}
            })
        }
        let isSubjectExist = await Subject.findOne({name:{$regex:'${name}',$options:'i'}});
        if(isSubjectExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Subject already exist",
                result:{}
            }) 
        }
        const fileUrl = await uploadOnCloudinary(req.file.path);
        let subject = new Subject({
           name:name,icon:fileUrl,color:color
        });

        subject = await subject.save();
        if(!subject){
            return res.send({
                statusCode:400,
                success:false,
                message:"failed to create subject",
                result:{}
            })
        }
    
        return res.send({
                statusCode:200,
                success:true,
                message:"subject created successfully",
                result:{}
        })
    
    } catch (error) {
        console.log("error in creating subject",error);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error.message}
    })
    }
}

exports.getSubjects = async(req,res)=>{

    try {
        let subjects = await Subject.find();
        if(!subjects){
            return res.send({
                statusCode:404,
                success:false,
                message:"No Subject Found",
                result:{}
            })
        }
        return res.send({
                statusCode:200,
                success:true,
                message:"subjects fetched successfully",
                result:{subjects}
        })

    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{}
    })
    }
}