const express= require('express');
const userRouter = express.Router();
const userController = require('./../controller/userController');


userRouter.post('/create-user',userController.createUser);


module.exports=userRouter;