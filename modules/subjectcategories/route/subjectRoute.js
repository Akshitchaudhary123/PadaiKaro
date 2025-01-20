const express= require('express');
const subjectController = require('./../controller/subjectController');
const upload = require('./../../../middlewares/multer')

const subjectRoute = express.Router();

subjectRoute.post('/create-subject',upload.single('file'),subjectController.createSubject);

subjectRoute.get('/get-subjects',subjectController.getSubjects);

module.exports = subjectRoute;