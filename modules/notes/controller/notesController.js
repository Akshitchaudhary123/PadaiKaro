const { uploadOnCloudinary } = require('../../../utils/cloudinary');
const Notes = require('./../model/notesModel');
const Category = require('./../../categories/model/categoryModel');
const { default: mongoose } = require('mongoose');


 exports.uploadNotes=async(req,res)=>{

     let {Title,Category,Class,Subject,Semester,Type,chapter,chapterName,year,set} =req.body;
    
     Title=Title?.trim();
     Category=Category?.trim();
     Subject=Subject?.trim();
     Type=Type?.trim();
     Class=Class?.trim();
     Semester=Semester?.trim();
     chapter=chapter?.trim();
     chapterName=chapterName?.trim();
     set=set?.trim();
     year=year?.trim();
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
    if (chapter) query.chapter = chapter;
    if (chapterName) query.chapterName = chapterName;
    if (set) query.set = set;
    if(year) query.year = year;
    

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
        const fileUrl = await uploadOnCloudinary(req?.file?.path);
       
        fileSize = req.file.size;
        fileSize = (fileSize/1048576).toFixed(2);
        console.log("File Size",fileSize);
    
        let notes = new Notes({
            title:Title,
            category:Category,
            class:Class,
            subject:Subject,
            semester:Semester||"",
            type:Type,
            year:year||"",
            set:set||"",
            chapter:chapter||"",
            chapterName:chapterName||"",
            fileUrl:fileUrl,
            fileSize:fileSize
    
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
              type: { $regex: 'ncert', $options: 'i' },
              class: Class, 
            },
          },
          {
            $addFields: {
              convertedSubject: { $toObjectId: '$subject' }, 
            },
          },
          {
            $lookup: {
              from: 'subjects',
              localField: 'convertedSubject',
              foreignField: '_id',
              as: 'subjectDetails', 
            },
          },
          {
            $group: {
              _id: '$subject', // Group by the 'subject' field
              subjectName: { $first: { $arrayElemAt: ['$subjectDetails.name', 0] } }, // Extract the subject name
              icon: { $first: { $arrayElemAt: ['$subjectDetails.icon', 0] } }, // Extract the icon
              color: { $first: { $arrayElemAt: ['$subjectDetails.color', 0] } }, // Extract the color
              books: {
                $push: {
                  _id: '$_id', // Include the note's _id
                  title: '$title', // Include the title of the note
                  fileUrl: '$fileUrl',
                  fileSize: '$fileSize' // Include the file URL
                },
              },
            },
          },
          {
            $project: {
              _id: 0, // Exclude the grouped _id (subject)
              subjectName: 1, // Include the subject name
              icon: 1, // Include the icon
              color: 1, // Include the color
              books: 1, // Include the grouped notes array
            },
          },
        ]);
        
        console.log(JSON.stringify(data, null, 2));
        
        
              
        
        // console.log(JSON.stringify(data, null, 2));
        
          
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
    

        const data = await Notes.aggregate([
          {
            $match: {
              type: { $regex: 'notes', $options: 'i' },
              class: Class, 
            },
          },
          {
            $addFields: {
              convertedSubject: { $toObjectId: '$subject' }, 
            },
          },
          {
            $lookup: {
              from: 'subjects',
              localField: 'convertedSubject',
              foreignField: '_id',
              as: 'subjectDetails', 
            },
          },
          {
            $group: {
              _id: '$subject', // Group by the 'subject' field
              subjectName: { $first: { $arrayElemAt: ['$subjectDetails.name', 0] } }, // Extract the subject name
              icon: { $first: { $arrayElemAt: ['$subjectDetails.icon', 0] } }, // Extract the icon
              color: { $first: { $arrayElemAt: ['$subjectDetails.color', 0] } }, // Extract the color
              books: {
                $push: {
                  _id: '$_id', // Include the note's _id
                  title: '$title', // Include the title of the note
                  fileUrl: '$fileUrl',
                  fileSize: '$fileSize' ,
                  chapterName:'$chapterName'// Include the file URL
                },
              },
            },
          },
          {
            $project: {
              _id: 0, // Exclude the grouped _id (subject)
              subjectName: 1, // Include the subject name
              icon: 1, // Include the icon
              color: 1, // Include the color
              books: 1, // Include the grouped notes array
            },
          },
        ]);
    
    console.log(JSON.stringify(data, null, 2));
 
     return res.send({
       statusCode:200,
       success:true,
       message:"Ncert Notes fetched successfully",
       result:{
       
            // notes,
            data
            // currentPage:Number.parseInt(page),
            // totalPage:Math.ceil(totalRecord/limit),
            // totalRecords:totalRecord
        
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
        
       
        let {categoryId,subjectId} = req.body;
        categoryId=categoryId?.trim();
        subjectId=subjectId?.trim();
        console.log("category Id",categoryId);
        console.log("subject Id",subjectId);
        if(!categoryId){
          return res.send({
              statusCode:400,
              success:false,
              message:"Category Id is required",
              result:{}
          })
      }

        if(!subjectId){
          return res.send({
              statusCode:400,
              success:false,
              message:"subject Id is required",
              result:{}
          })
      }
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

        let papersByYear = await Notes.aggregate([
          {
            $match: {
              type: { $regex: 'previouspaper', $options: 'i' },
              class: Class, 
              subject: new mongoose.Types.ObjectId(subjectId)
            }
          },
          {
            $sort:{
              set:1
            }
          },
          {
            $group:{
              _id:'$year',
             papers:{
              $push:{
                paperUrl:'$fileUrl',
                paperSize:'$fileSize',
                set:'$set'
              }
             } 
            }
          }
          
          
        ]);
        
       
        console.log(papersByYear);
        
        
        if(!papersByYear){
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
       
        papersByYear,
           
        
       }
     })

   } catch (error) {
     console.log("error in fetching previous year papers",error);
     return res.send({
       statusCode:500,
       success:false,
       message:"Internal Server Error",
       result:{error:error.message}
     })
   }
}