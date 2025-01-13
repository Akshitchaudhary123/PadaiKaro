const express = require('express');
const notesRouter = express.Router();
const notesContrroller = require('../controller/notesController');
const upload = require('../../../middlewares/multer');
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;



notesRouter.post('/upload-notes',verifyToken,upload.single('file'),notesContrroller.uploadNotes);
notesRouter.get('/get-all-notes',verifyToken,notesContrroller.getAllNotes);
notesRouter.get('/get-ncert-books/:categoryId',verifyToken,notesContrroller.getNcertBooks);
notesRouter.get('/get-ncert-notes/:categoryId',verifyToken,notesContrroller.getNcertNotes);
notesRouter.get('/get-pyq/:categoryId',verifyToken,notesContrroller.getPYQ);

module.exports=notesRouter;



// User.find().sort({'score':-1,'timeTaken':1})