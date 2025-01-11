const express = require('express');
const notesRouter = express.Router();
const notesContrroller = require('../controller/notesController');
const upload = require('../../../middlewares/multer');
const verifyToken = require('./../../../middlewares/verifyJWT').verifyToken;



notesRouter.post('/upload-notes',verifyToken,upload.single('file'),notesContrroller.uploadNotes);
notesRouter.get('/get-all-notes',verifyToken,notesContrroller.getAllNotes);
notesRouter.get('/get-ncert-books/:class',verifyToken,notesContrroller.getNcertBooks);
notesRouter.get('/get-ncert-notes/:class',verifyToken,notesContrroller.getNcertNotes);
notesRouter.get('/get-pyq/:class',verifyToken,notesContrroller.getPYQ);

module.exports=notesRouter;