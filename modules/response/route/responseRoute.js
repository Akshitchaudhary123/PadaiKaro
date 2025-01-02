const express = require('express');
const responseRouter = express.Router();
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;
const responseController = require('./../controller/responseController');
const upload = require('./../../../middlewares/multer');


responseRouter.post('/save-response',verifyToken,upload.none(),responseController.saveResponse);

module.exports=responseRouter;