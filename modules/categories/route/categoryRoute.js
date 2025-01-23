const express= require('express');
const categoryController = require('./../controller/categoryController');
const upload = require('./../../../middlewares/multer')

const categoryRouter = express.Router();

categoryRouter.post('/create-category',upload.single('file'),categoryController.createCategory);

categoryRouter.get('/get-category',categoryController.getCategory);

categoryRouter.get('/get-category-subjects/:categoryId',categoryController.getSubjects);

module.exports = categoryRouter;