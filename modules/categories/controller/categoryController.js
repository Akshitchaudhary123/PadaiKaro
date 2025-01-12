const Category = require('./../model/categoryModel');

exports.createCategory = async(req,res)=>{

    try {
        let{Name,Class} = req.body;

        // Name = req.body.Name;
        console.log("Name",Name);
        console.log("Class",Class);
    
        if(!Name || !Class ){
            return res.send({
                statusCode:400,
                success:false,
                message:"All fields are required",
                result:{}
            })
        }
        let isCategoryExist = await Category.findOne({name:Name,class:Class});
        if(isCategoryExist){
            return res.send({
                statusCode:400,
                success:false,
                message:"Category already exist",
                result:{}
            }) 
        }
        let category = new Category({
            name:Name,class:Class
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