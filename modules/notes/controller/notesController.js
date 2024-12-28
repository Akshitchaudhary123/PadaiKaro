const { uploadOnCloudinary } = require('../../../utils/cloudinary');
const Notes = require('./../model/notesModel');


 exports.uploadNotes=async(req,res)=>{

     let {Title,Category,Class,Subject,Semester,Type} =req.body;
     Title=Title?.toLowerCase().trim();
     Category=Category?.toLowerCase().trim();
     Subject=Subject?.toLowerCase().trim();
     Type=Type?.toLowerCase().trim();
     Class=Class?.toLowerCase().trim();
     Semester=Semester?.toLowerCase().trim();

     if(!Title){
        return res.send({
            statusCode:400,
            success:false,
            message:"Title is required",
            result:{}
        })
     }
     if(!Category){
        return res.send({
            statusCode:400,
            success:false,
            message:"Category is required",
            result:{}
        })
     }
     if(!Subject){
        return res.send({
            statusCode:400,
            success:false,
            message:"Subject is required",
            result:{}
        })
     }
     if(!Type){
        return res.send({
            statusCode:400,
            success:false,
            message:"Type is required",
            result:{}
        })
     }
     if(Category==='school'&& (!Class)){
        return res.send({
            statusCode:400,
            success:false,
            message:"Class is required",
            result:{}
        })
     }
     if(Category==='college'&& (!Semester)){
        return res.send({
            statusCode:400,
            success:false,
            message:"Semester is required",
            result:{}
        })
     }

     let query = {};

    if (Title) query.title = Title;
    if (Category) query.category = Category;
    if (Subject) query.subject = Subject;
    if (Type) query.type = Type;
    if (Semester) query.semester = Semester;
    if (Class) query.class = Class;

    let notes = await Notes.findOne(query);

    
     if(notes){
        return res.send({
            statusCode:400,
            success:false,
            message:"This Notes is already exist",
            result:{
                notes:notes
            }
        })
     }
    
    try {
        const fileUrl = await uploadOnCloudinary(req.file.path);
    
        let notes = new Notes({
            title:Title,
            category:Category,
            class:Class,
            subject:Subject,
            semester:Semester,
            type:Type,
            fileUrl:fileUrl
    
        })
        notes = await notes.save();
        if(!notes){
           return  res.send({
                statusCode:400,
                success:false,
                message:"failed to create notes",
                result:{}
    
    
            })
        }
       
        return  res.send({
            statusCode:200,
            success:true,
            message:"notes created successfully",
            result:{notes:notes}
    
    
        })
    } catch (error) {
        console.log(`error in creating notes: ${error}`);
        return  res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{}


        })
    }
    




}

exports.getAllNotes = async(req,res)=>{

   try {
     let {limit=10,page=1} = req.query;
     let skip = (page-1)*limit;
     let totalNotes = await Notes.countDocuments();
     console.log("Total number of documents:", totalNotes);

     let notes = await Notes.find().limit(limit).skip(skip);
     if(!notes){
         return res.send({
             statusCode:404,
             success:false,
             message:"No Notes Found",
             result:{}
 
 
         })
     }
 
     return res.send({
         statusCode:200,
         success:true,
         message:"Notes fetched successfully",
         result:{
             notes:notes,
             currentPage:page,
             totalPage:Math.floor(totalNotes/limit)
         }
 
 
     })
   } catch (error) {
    console.log("error in get all notes: ",error);
    return res.send({
        statusCode:500,
        success:false,
        message:"Internal Server Error",
        result:{
        }
    })
   }
}