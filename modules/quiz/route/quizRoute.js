const express = require('express');
const quizRouter = express.Router();
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;
const quizController = require('./../controller/quizController');
const upload = require('./../../../middlewares/multer');


quizRouter.post('/create-quiz',verifyToken,upload.none(),quizController.createQuiz);
quizRouter.post('/update-quiz',verifyToken,upload.none(),quizController.updateQuiz);
quizRouter.get('/quiz-questions/:quizId',verifyToken,upload.none(),quizController.getQuiz);

module.exports=quizRouter;