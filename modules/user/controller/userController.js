const User = require('./../model/userModel');
const validator = require('validator');
const brcypt = require('bcryptjs');
const { generateToken } = require('../../../middlewares/verifyJWT');


exports.createUser =async (req,res)=>{

    try {
        let {name,email,password,education} = req.body;
    
        name=name?.trim();
        email=email?.trim();
        password=password?.trim();
        education=education?.trim();
    
        if(!name){
            return res.send({
                statusCode:404,
                success:false,
                message:'name is required',
                result:{}
            })
        }
        if(!email){
            return res.send({
                statusCode:404,
                success:false,
                message:'email is required',
                result:{}
            })
        }
        if(!validator.isEmail(email)){
            return res.send({
                statusCode:400,
                success:false,
                message:'email is Invalid',
                result:{}
            })
        }
        if(!password){
            return res.send({
                statusCode:404,
                success:false,
                message:'password is required',
                result:{}
            })
        }
        if(!validator.isStrongPassword(password,{minLength: 8,minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
            return res.send({
                statusCode:400,
                success:false,
                message:'password is Invalid',
                result:{}
            })
        }
    
        if(!education){
            return res.send({
                statusCode:404,
                success:false,
                message:'education is required',
                result:{}
            })
        }

        let user = await User.findOne({email:email});
        if(user){
            return res.send({
                statusCode:400,
                success:false,
                message:'user already exist',
                result:{}
            })
        }
        password = await brcypt.hashSync(password,10);
    
         user = new User({name,email,password,education});
        user= await user.save();
        if(!user){
            return res.send({
                statusCode:400,
                success:false,
                message:'failed to create user',
                result:{}
            })
        }
       
       let token= generateToken({_id:user._id,name,email});
    
        return res.send({
            statusCode:201,
            success:true,
            message:'user created successfully',
            result:{user,
                token:token
            }
            
        })
    
    } catch (error) {
        console.log(`error in creating user: ${error}`);
        return res.send({
            statusCode:500,
            success:true,
            message:'Internal server error',
            result:{user,
                token:token
            }
            
        })
    }


}