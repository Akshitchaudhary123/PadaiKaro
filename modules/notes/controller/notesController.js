const { uploadOnCloudinary } = require('../../../utils/cloudinary');
const Notes = require('./../model/notesModel');
const Category = require('./../../categories/model/categoryModel')


 exports.uploadNotes=async(req,res)=>{

     let {Title,Category,Class,Subject,Semester,Type} =req.body;
     Title=Title?.trim();
     Category=Category?.trim();
     Subject=Subject?.trim();
     Type=Type?.trim();
     Class=Class?.trim();
     Semester=Semester?.trim();
     if(Category=='school'){
        Semester='';
     }
     if(Category=='college'){
       Class="";
     }

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

     let notes = await Notes.find().limit(limit).skip(skip).select('-_id -__v ');
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
             notes:Number.parseInt(page),
             currentPage:page,
             totalPage:Math.ceil(totalNotes/limit),
             totalRecords:totalNotes
         }
 
 
     })
   } catch (error) {
    console.log("error in get all notes: ",error);
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

exports.getNcertBooks = async(req,res)=>{

    try {

        
        let {limit=10,page=1} = req.query;
        let categoryId = req.params.categoryId;
        
        // console.log("category Id",categoryId);
        let category = await Category.findById(categoryId);
        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category not found",
                result:{}
            })
        }
        let Class = category.class;

        const data = await Notes.aggregate([
            {
              $match: {
                type: { $regex: 'ncert', $options: 'i' }, // Matches "ncert" case-insensitively
                class: Class, // Filters by class
              },
            },
            {
              $group: {
                _id: '$subject', // Group by the "subject" field
                books: {
                  $push: {
                    title: '$title', // Include the title in the grouped result
                    fileUrl: '$fileUrl', // Include the file URL
                    chapter: '$chapter', // Include the chapter
                    class: '$class', // Include the class
                  },
                },
              },
            },
            {
              $project: {
                _id: 0, // Exclude the default _id field from the output
                subject: '$_id', // Rename _id to "subject"
                books: 1, // Include the "books" array
              },
            },
          ]);
          
        //   console.log(data);
          
    //    console.log(books);

        // // console.log("category class:",Class);
        // let skip = (page-1)*limit;
        // let books = await Notes.find({type:{$regex:'ncert',$options:'i'},class:Class}).select('-_id -__v ').skip(skip).limit(limit);
        // let totalRecord = await Notes.find({type:{$regex:'ncert',$options:'i'},class:Class}).countDocuments();
        if(!data){
         return res.send({
         statusCode:404,
         success:false,
         message:"No Ncert Book Found",
         result:{}
 
         })
        
     }
 
     return res.send({
       statusCode:200,
       success:true,
       message:"Books fetched successfully",
       result:{
       
            data,
            // currentPage:Number.parseInt(page),
            // totalPage:Math.ceil(totalRecord/limit),
            // totalRecords:totalRecord
        
       }
     })

   } catch (error) {
     console.log("error in fetching ncert books",error);
     return res.send({
       statusCode:500,
       success:false,
       message:"Internal Server Error",
       result:{error}
     })
   }
}

exports.getNcertNotes = async(req,res)=>{

    try {
        
        let {limit=10,page=1} = req.query;
        let categoryId = req.params.categoryId;
        // console.log("category Id",categoryId);
        let category = await Category.findById(categoryId);
        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category not found",
                result:{}
            })
        }
        // console.log("category:",category);
        let Class = category.class;
        console.log("class :",Class);
        let skip = (page-1)*limit;
        let notes = await Notes.find({type:{$regex:'notes',$options:'i'},class:Class}).select('-_id -__v ').skip(skip).limit(limit);
        let totalRecord = await Notes.find({type:{$regex:'notes',$options:'i'},class:Class}).countDocuments();
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
       message:"Ncert Notes fetched successfully",
       result:{
       
            notes,
            currentPage:Number.parseInt(page),
            totalPage:Math.ceil(totalRecord/limit),
            totalRecords:totalRecord
        
       }
     })

   } catch (error) {
     console.log("error in fetching ncert notes",error);
     return res.send({
       statusCode:500,
       success:false,
       message:"Internal Server Error",
       result:{error:error.message}
     })
   }
}

 exports.getPYQ = async(req,res)=>{

    try {
        
        let {limit=10,page=1} = req.query;
        let categoryId = req.params.categoryId;
        // console.log("category Id",categoryId);
        let category = await Category.findById(categoryId);
        if(!category){
            return res.send({
                statusCode:404,
                success:false,
                message:"Category not found",
                result:{}
            })
        }
        // console.log("category:",category);
        let Class = category.class;
        let skip = (page-1)*limit;
        let papers = await Notes.find({type:{$regex:'pyq',$options:'i'},class:Class}).select('-_id -__v ').skip(skip).limit(limit);
        let totalRecord = await Notes.find({type:{$regex:'pyq',$options:'i'},class:Class}).countDocuments();
        if(!papers){
         return res.send({
         statusCode:404,
         success:false,
         message:"No Papers Found",
         result:{}
 
         })
        
     }
 
     return res.send({
       statusCode:200,
       success:true,
       message:"Previous Year Papers fetched successfully",
       result:{
       
            papers,
            currentPage:Number.parseInt(page),
            totalPage:Math.ceil(totalRecord/limit),
            totalRecords:totalRecord
        
       }
     })

   } catch (error) {
     console.log("error in fetching previous year papers",error);
     return res.send({
       statusCode:500,
       success:false,
       message:"Internal Server Error",
       result:{error}
     })
   }
}