const Category = require('./../model/categoryModel');
const {uploadOnCloudinary} = require('./../../../utils/cloudinary');

exports.createCategory = async(req,res)=>{

    try {
        let{name,title,subTitle,Class,color,subjects} = req.body;
        name=name?.trim();
        title=title?.trim();
        subTitle=subTitle?.trim();
        Class=Class?.trim();
        color=color?.trim();

        // Name = req.body.Name;
        console.log("Name",name);
        // console.log("Class",class);
    
        if(!name|| !title || !Class || !color||!subTitle ){
            return res.send({
                statusCode:400,
                success:false,
                message:"All fields are required",
                result:{}
            })
        }
        let isCategoryExist = await Category.findOne({name:name,class:Class});
        if(isCategoryExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Category already exist",
                result:{}
            }) 
        }
        const fileUrl = await uploadOnCloudinary(req.file.path);

        subjects = JSON.parse(subjects);
        console.log("subjects",subjects)
        let category = new Category({
           name:name, title:title,class:Class,icon:fileUrl,color:color,subTitle:subTitle,subjects
        });

        category = await category.save();
        if(!category){
            return res.send({
                statusCode:400,
                success:false,
                message:"failed to create category",
                result:{}
            })
        }
    
        return res.send({
                statusCode:200,
                success:true,
                message:"category created successfully",
                result:{}
        })
    
    } catch (error) {
        console.log("error in creating category",error);
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error}
    })
    }
}

exports.getCategory = async(req,res)=>{

    try {
        let categories = await Category.find();
        if(!categories){
            return res.send({
                statusCode:404,
                success:false,
                message:"No Category Found",
                result:{}
            })
        }
        return res.send({
                statusCode:200,
                success:true,
                message:"Categories fetched successfully",
                result:{categories}
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

exports.getSubjects = async(req,res)=>{

    try {
        let {categoryId} = req.params;
        categoryId = categoryId?.trim();
        if(!categoryId){
            return res.send({
                statusCode:400,
                success:false,
                message:"category Id is required",
                result:{}
            })
        }

        let subjects = await Category.findById(categoryId).populate({path:'subjects',select:'name'}).select('_id');
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
                message:"Subjects fetched successfully",
                result:{data:subjects.subjects}
        })

    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{error:error.message}
    })
    }

}