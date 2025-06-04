// require('dotenv').config({path:"./env"});                  // ok approach

//  here improve approach

import dotenv from "dotenv";


import connectDB from './db/indexMongo.js';


dotenv.config({
    path:"./env"
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at Port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!!", err);
    
})






// 1st appraoch to connect database 
// for optimal approach , we use different file folder to connect them


/*

import express from 'express';
const app=express();

// 1st way
// function connectDB(){}




// connectDB()


// better way

(async ()=>{

    try {

        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        // app.on("Error",()=>{
        //     console.log("ERror",error);
        //     throw error;
        // })

        app.on("Error",(error)=>{
            console.log("ERR",Error);
            throw error;
            
        });


        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on Port ${process.env.PORT}`);
        });
    }
    
    catch (error) {
        console.error("ERROR",error);
        throw error;
    }

})()



*/