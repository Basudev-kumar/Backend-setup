import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))


app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({extended:true,limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser());







// app.listen(process.env.PORT,(error)=>{

//     console.log("Error",error);

//     process.exit(1);


    
// })



// routes import

import userRouter from './routes/user.routes.js'


// routes declaration

app.use("/api/v1/users",userRouter);

// http://localhost:5000/api/v1/users/register
// http://localhost:5000/users/login



export {app}