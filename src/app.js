import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))







app.listen(process.env.PORT,(error)=>{

    console.log("Error",error);

    process.exit(1);


    
})

export {app}