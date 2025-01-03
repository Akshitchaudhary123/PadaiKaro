const User = require('./../model/userModel');
const validator = require('validator');
const brcypt = require('bcryptjs');
const { generateToken } = require('../../../middlewares/verifyJWT');
const  sendEmail  = require('../../../utils/nodeMailer');
const generateOTP =require('./../../../utils/generateOTP');
const { uploadOnCloudinary } = require('../../../utils/cloudinary');
const { findByIdAndUpdate } = require('../../notes/model/notesModel');


exports.createUser =async (req,res)=>{

    try {
        let {name,email,password} = req.body;
       
        name=name?.toLowerCase().trim();
        email=email?.toLowerCase().trim();
        password=password?.trim();
        console.log(`name : ${name}`);
        console.log(`email : ${email}`);
        console.log(`password : ${password}`);
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
    
         user = new User({name,email,password});
        user= await user.save();
        if(!user){
            return res.send({
                statusCode:400,
                success:false,
                message:'failed to create user',
                result:{}
            })
        }
       
       
    
        return res.send({
            statusCode:201,
            success:true,
            message:'user created successfully',
            result:{
                // user,
            }
            
        })
    
    } catch (error) {
        console.log(`error in creating user: ${error}`);
        return res.send({
            statusCode:500,
            success:true,
            message:'Internal server error',
            result:{
            }
            
        })
    }


}

exports.sendOTP=async(req,res)=>{
   try {
     let {email} = req.body;
     email=email?.toLowerCase().trim();
 
     let user= await User.findOne({email:email});
     if(!user){
         return res.send({
             statusCode:404,
             success:false,
             message:"No user found",
             result:{}
         })
     }
  
     let otp = generateOTP();
     
 
     
       // Send email with otp
       let subject = "Verify Email ";
       let html = `<body style="background-color: #f7fafc; margin: 0; padding: 0;">
   <div style="max-width: 24rem; margin: 2rem auto; padding: 1rem; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0.5rem; text-align: center;">
     <h1 style="font-size: 1.5rem; font-weight: bold; color: #2d3748;">Padai Karo</h1>
     <p style="color: #718096; margin-top: 0.5rem;">We received a request to verify your account with an OTP.</p>
     <p style="color: #718096; margin-top: 1rem;">Your OTP is:</p>
     <p style="font-size: 1.25rem; font-weight: bold; color: #3182ce; margin-top: 0.5rem;"> ${otp}</p>
     <p style="color: #718096; margin-top: 1rem;">If you did not request this, please ignore this email.</p>
   </div>
  </body>`;
 
        console.log(`email in verify user ${email}`);
        sendEmail(email, subject, html);
        otp = otp.toString();
        console.log(typeof(otp));
 
 
        const otpExpireTime= Date.now()+1000*60  // one minute
        user = await User.findOneAndUpdate({email:email},{
         $set:{
            otp:otp,
            otpExpireTime:otpExpireTime 
         }
        },{new:true})
 
        res.send({
         statusCode:200,
         success:true,
         message:"verify email with otp",
         result:{
          OTP:otp,
         //  user:user
         }
        })

   } catch (error) {
    console.log(`error in send otp: ${error}`);
    return res.send({
        statusCode:500,
        success:false,
        message:"Internal Server Error",
        result:{}
    })
    
   }

}

exports.verifyOTP=async (req,res)=>{
    let {email,otp} = req.body;
    email=email?.toLowerCase().trim();

    let user = await User.findOne({email:email});
    if(!user){
        return res.send({
            statusCode:404,
            success:false,
            message:"User not found",
            result:{}
        })
    }

    if (otp.length < 4) {
        return res.send({
          statusCode: 400,
          success: false,
          message: "OTP must be 4 digits",
          result: {},
        });
      }

    if(Date.now()>user.otpExpireTime){
        return res.send({
            statusCode:400,
            success:false,
            message:"OTP Time Expired",
            result:{}
        })
    }

    if(otp!=user.otp){
        return res.send({
            statusCode:400,
            success:false,
            message:"OTP not matched",
            result:{}
        })
    }
   
    user = await User.findOneAndUpdate({email:email},{
        $set:{
            authorised:true
        }
    },{new:true});

    let token= generateToken({_id:user._id,name:user.name,email}); 
       return res.send({
        statusCode:200,
        success:true,
        message:"OTP matched successfully",
        result:{
            
            token:token
        }
    })



}

exports.resetPassword=async(req,res)=>{
try {
    
        let {email,newPassword,confirmPassword} = req.body;
        email=email?.toLowerCase().trim();
        newPassword=newPassword?.trim();
        confirmPassword=confirmPassword?.trim();
    
        let user= await User.findOne({email:email});
        if(!user){
            
                return res.send({
                  statusCode: 400,
                  success: false,
                  message: "user not registered",
                  result: {},
                });
        }
    
        if (!newPassword || !confirmPassword) {
            return res.send({
              statusCode: 400,
              success: false,
              message: "New Password and Confirm Password are required",
              result: {},
            });
          }
    
        if(newPassword!=confirmPassword){
            return res.send({
                statusCode: 400,
                success: false,
                message: "New Password and Confirm Password not matched",
                result: {},
              });
        }
    
        if(!validator.isStrongPassword(newPassword,{minLength: 8,minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})){
            return res.send({
                statusCode: 400,
                success: false,
                message: "Invalid Password",
                result: {},
              });
        }
    
        let isPasswordSame = await brcypt.compare(newPassword,user.password);
        if(isPasswordSame){
            
                return res.send({
                  statusCode: 400,
                  success: false,
                  message: "New Password can't be same as Old password",
                  result: {},
                });
              
        }
        newPassword =  brcypt.hashSync(newPassword,10);
    
        user = await User.findOneAndUpdate({email},{
            $set:{
               password:newPassword
            }
        },{new:true})
    
        
            return res.send({
              statusCode: 200,
              success: true,
              message: "Password reset successfully",
              result: {
                name:user.name,
                email:user.email
              },
            });
          
    } catch (error) {
        console.log(`error in reset password ${error}`);

        return res.send({
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            result: {
             
            },
          });
    
}



}

exports.login=async(req,res)=>{

    try {
        let {email,password}= req.body;
        email=email?.toLowerCase().trim();
        password=password?.trim();
    
        if(!email){
            return res.send({
                statusCode: 400,
                success: false,
                message: "email is required",
                result: {},
              });
        }
        if(!password){
            return res.send({
                statusCode: 400,
                success: false,
                message: "password is required",
                result: {},
              });
        }
       
        let user = await User.findOne({email});
        if(!user){
            return res.send({
                statusCode: 404,
                success: false,
                message: "User not found",
                result: {},
              });
        }
        console.log(`password: ${password}`);
        let isPasswordSame = await brcypt.compare(password,user.password);
        console.log(`isPasswordSame : ${isPasswordSame}`);
            if(!isPasswordSame){
                
                    return res.send({
                      statusCode: 400,      
                      success: false,
                      message: "Wrong Password",
                      result: {},
                    });
                  
            }
    
            let token =  generateToken({_id:user._id,name:user.name,email:user.email});
            return res.send({
                statusCode: 200,
                success: true,
                message: "user login successfully",
                result: {
                    token:token
                },
              });
    } catch (error) {
        console.log(`error in login ${error}`);
        return res.send({
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            result: {},
          });
        
    }
    

}

exports.userDetails = async(req,res)=>{
try {
     let {_id} = req.token;
     console.log(`_id: ${_id}`);
    
     let user = await User.findById({_id}).select('-_id -__v -status -otpExpireTime -otp -authorised -password');
     if(!user){
        return res.send({
            statusCode: 404,
            success: false,
            message: "user not found",
            result: {},
          });
     }
    
     return res.send({
        statusCode: 200,
        success: true,
        message: "user details fetched successfully",
        result: {
            user:user
        },
      });
} catch (error) {
    return res.send({
        statusCode: 500,
        success: false,
        message: "Internal Server Error",
        result: {},
      });
}

}

exports.editProfile = async(req,res)=>{
    try {
        let {name,education,bio,interests} =req.body;
        let {_id} =req.token;
        console.log(interests);
    
    
        name=name.trim();
        education=education.trim();
        bio=bio.trim();
    
        let user = await User.findById(_id);
            if(!user){
                return res.send({
                    statusCode: 404,
                    success: false,
                    message: "user not found",
                    result: {},
                  });
             }
             let profileUrl=user.profileUrl;
            if(req.file){
    
              profileUrl= await  uploadOnCloudinary(req.file.path);
            }
    
            name=name??user.name;
            education=education??user.education;
            bio=bio??user.bio;
            profileUrl=profileUrl??user.profileUrl;
            if(interests.length==0){
                interests=user.interests
            }
    
            user = await User.findOneAndUpdate({_id:_id},{
                $set:{
                    name:name,
                    education:education,
                    bio:bio,
                    profileUrl:profileUrl,
                    interests:interests
               }
            },{new:true})
    
                return res.send({
                    statusCode: 200,
                    success: true,
                    message: "user updated successfully",
                    result: {
                        user:user
                    },
                  });
             
    } catch (error) {
        console.log('error in edit profile: ',error);
        return res.send({
            statusCode: 500,
            success: false,
            message: "Internal Server Error",
            result: {},
          });
    }

    


}