const express= require('express');
const userRouter = express.Router();
const userController = require('./../controller/userController');
const upload = require('./../../../middlewares/multer.js');



userRouter.post('/create-user',upload.none(),userController.createUser);
userRouter.post('/send-otp',upload.none(),userController.sendOTP);
userRouter.post('/verify-otp',upload.none(),userController.verifyOTP);
userRouter.post('/reset-password',upload.none(),userController.resetPassword);
userRouter.post('/login',upload.none(),userController.login);


module.exports=userRouter;