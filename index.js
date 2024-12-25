const express =require('express');
const app=express();
const cors=require('cors');
const {dbConnection}=require('./db/dbonnection.js');
const {routes} = require('./routes.js');
require('dotenv').config();

app.use(express.json());
app.use(cors());

console.log('Loaded routes:', routes);

routes.map((route) => {
    app.use(route.path, route.handler);
})

const Port =process.env.PORT || 5000;


app.listen(Port,async (req,res)=>{
    await dbConnection();
    console.log(`server is listening ${Port} ..`);
})










