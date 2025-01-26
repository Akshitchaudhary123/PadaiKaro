const userRouter = require('./modules/user/route/userRoute.js');
const notesRouter = require('./modules/notes/route/notesRoute.js');
const quizRouter = require('./modules/quiz/route/quizRoute.js');
const responseRouter= require('./modules/response/route/responseRoute.js');
const categoryRouter = require('./modules/categories/route/categoryRoute.js');
const subjectRouter =require('./modules/subjectcategories/route/subjectRoute.js');
const trickRouter = require('./modules/tricks/route/trickRoute.js')

// Primary Routes
exports.routes=[
    {
   
        path : "/api/user",
        handler : userRouter,
        schema : 'User'
    },
    {
        path : "/api/notes",
        handler : notesRouter,
        schema : 'Notes'
    },
    {
        path:"/api/quiz",
        handler:quizRouter,
        schema:'Quiz'
    },
    {
        path:"/api/response",
        handler:responseRouter,
        schema:'Response'
    },
    {
        path:"/api/category",
        handler:categoryRouter,
        schema:'Category'
    },
    {
        path:"/api/subject",
        handler:subjectRouter,
        schema:'Subject'
    },
    {
        path:"/api/trick",
        handler:trickRouter,
        schema:'Trick'
    }

]

