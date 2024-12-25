const userRouter = require('./modules/user/route/userRoute.js');

// Primary Routes
exports.routes=[
    {
   
        path : "/api/user",
        handler : userRouter,
        schema : 'User'
    }

]

