const express= require('express');
const subjectController = require('./../controller/subjectController');
const upload = require('./../../../middlewares/multer');
const { verifyToken } = require('../../../middlewares/verifyJWT');

const subjectRoute = express.Router();

subjectRoute.post('/create-subject',verifyToken,upload.single('file'),subjectController.createSubject);

subjectRoute.get('/get-subjects',verifyToken,subjectController.getSubjects);

module.exports = subjectRoute;