const express = require('express');
const quizRouter = express.Router();
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;
const quizController = require('./../controller/quizController');
const upload = require('./../../../middlewares/multer');


quizRouter.post('/create-quiz',verifyToken,upload.single('file'),quizController.createQuiz);
quizRouter.post('/update-quiz',verifyToken,upload.none(),quizController.updateQuiz);
quizRouter.get('/quiz-questions/:quizId',verifyToken,upload.none(),quizController.getQuiz);
quizRouter.get('/quiz-categories',verifyToken,upload.none(),quizController.quizCategories);
quizRouter.get('/quiz-categories-levels/:categoryId',verifyToken,upload.none(),quizController.quizCategoriesLevels);

module.exports=quizRouter;