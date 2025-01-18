const express= require('express');
const categoryController = require('./../controller/categoryController');
const upload = require('./../../../middlewares/multer')

const categoryRouter = express.Router();

categoryRouter.post('/create-category',upload.single('file'),categoryController.createCategory);

categoryRouter.get('/get-category',categoryController.getCategory);

module.exports = categoryRouter;