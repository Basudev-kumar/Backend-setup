import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

const registerUser=asyncHandler(async (req,res) =>{
    
    // testing
    // res.status(200).json({
    //     message:"Ok Done!"
    // })




    // get user details from frontend
    // validation - not empty
    // check if user already exits : username , email
    // check for images , check for avatar
    // upload them to cloudinary , avatar
    // create user object , create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName , username , email , password} = req.body;
    console.log("email : ",email)

    if (fullName==="") {
        throw new ApiError(400,"Fullname is required");
    }

})


export {registerUser};