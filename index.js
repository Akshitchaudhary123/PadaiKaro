const express =require('express');
const app=express();
const cors=require('cors');
const {dbConnection}=require('./db/dbonnection.js');

app.use(express.json());
app.use(cors());


app.listen(5000,async (req,res)=>{
    await dbConnection();
    console.log('server is listening 5000..');
})










