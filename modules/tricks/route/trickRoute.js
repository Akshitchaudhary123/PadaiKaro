const express = require('express');
const trickRoute = express.Router();
const trickController = require('../controller/trickController');
const upload = require('../../../middlewares/multer');
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;



trickRoute.post('/create-trick',verifyToken,upload.single('file'),trickController.createTrick);


module.exports=trickRoute;



// User.find().sort({'score':-1,'timeTaken':1})