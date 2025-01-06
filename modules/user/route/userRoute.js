const express= require('express');
const userRouter = express.Router();
const userController = require('./../controller/userController');
const upload = require('./../../../middlewares/multer.js');
const verifyToken = require('./../../../middlewares/verifyJWT.js').verifyToken



userRouter.post('/create-user',upload.none(),userController.createUser);
userRouter.post('/send-otp',upload.none(),userController.sendOTP);
userRouter.post('/verify-otp',upload.none(),userController.verifyOTP);
userRouter.post('/reset-password',upload.none(),userController.resetPassword);
userRouter.post('/login',upload.none(),userController.login);
userRouter.get('/user-details',verifyToken,userController.userDetails);
userRouter.post('/edit-profile',verifyToken,upload.single('file'),userController.editProfile);
userRouter.post('/update-category',verifyToken,upload.single('file'),userController.updateCategory);


module.exports=userRouter;