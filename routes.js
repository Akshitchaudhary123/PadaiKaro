const userRouter = require('./modules/user/route/userRoute.js');
const notesRouter = require('./modules/notes/route/notesRoute.js')

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
    }

]

