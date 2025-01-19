const Category = require('./../model/categoryModel');
const {uploadOnCloudinary} = require('./../../../utils/cloudinary');

exports.createCategory = async(req,res)=>{

    try {
        let{title,subTitle,Class,color} = req.body;
        title=title?.trim();
        subTitle=subTitle?.trim();
        Class=Class?.trim();
        color=color?.trim();

        // Name = req.body.Name;
        console.log("Name",title);
        console.log("Class",subTitle);
    
        if(!title || !Class || !color||!subTitle ){
            return res.send({
                statusCode:400,
                success:false,
                message:"All fields are required",
                result:{}
            })
        }
        let isCategoryExist = await Category.findOne({title:title,class:Class});
        if(isCategoryExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Category already exist",
                result:{}
            }) 
        }
        const fileUrl = await uploadOnCloudinary(req.file.path);
        let category = new Category({
            title:title,class:Class,icon:fileUrl,color:color,subTitle:subTitle
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