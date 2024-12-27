const express= require('express');
const userRouter = express.Router();
const userController = require('./../controller/userController');


userRouter.post('/create-user',userController.createUser);
userRouter.post('/send-otp',userController.sendOTP);
userRouter.post('/verify-otp',userController.verifyOTP);
userRouter.post('/reset-password',userController.resetPassword);
userRouter.post('/login',userController.login);


module.exports=userRouter;