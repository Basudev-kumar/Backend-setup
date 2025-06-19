import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponce.js";



const generateAccessAndRefreshTokens=async(userId) => {

    try {
        
        const user = await User.findById(userId)

        const refreshToken=user.generateRefreshToken()
        const accessToken=user.generateAccessToken()


        user.refreshToken=refreshToken
        await user.save({ validateBeforeSave:false })

        return{accessToken,refreshToken};


    } catch (error) {
        
        throw new ApiError(500,"Something went wrong while generating the refresh and access token");
    }
}


const registerUser=asyncHandler(async (req,res) =>{
    
    // testing
    // res.status(200).json({
    //     message:"Ok Done!"
    // })



    // important steps:-
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

    // if (fullName==="") {
    //     throw new ApiError(400,"Fullname is required");
    // }

    // OR



    if(
        [fullName,username,email,password].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields are required");
    }






    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists");
    }


    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }



   
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")

    }

    


    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })


    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user");
    }



    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )

})



const loginUser = asyncHandler(async (req,res)=>{

    // req body -> data
    // username or email
    // find username
    // password check
    // access & refresh token
    // send cookie

    // OR (another steps)

    // Steps To Follow :
    //1. Get User's Credentials (username, password, email).
    //2. Check if user exist or not.
    //3. If Exist, Check Credentials Validity.
    //4. Generate Access Token & Refresh Token.
    //5. Save Refresh Token in DB and Respond(Secure Cookies) it to User.
    //6. Give Access Token with the Response also(Refresh + Access), don't Save in DB.
    //7. Now next time when User want to Login, Get Access Token(if not expired) from User.
    //8. If Access Token is Expired, Get Refresh Token from User Side.
    //9. If Refresh Token is not Expired, Generate NEW Access Token, and Response it back to User.
    //10. If Refresh Token is also Expired, Then We have to ask for User Credentials Again.



    const {username , email , password}=req.body

    if(!username || !email){

        throw new ApiError(400,"username or password is required")
    }

     
    const user= await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        
        throw new ApiError(404,"username does not exist")
    }


    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        
        throw new ApiError(404,"Password is incorrect");
        // throw new ApiError(404,"Invalid user credentials");
    }



    const {refreshToken,accessToken}=await generateAccessAndRefreshTokens(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    const options={
        httpOnly:true,
        secure:true
    }


    return res
    .status(200)
    .cookie("accessToken",accessToken , options)
    .cookie("refreshToken",refreshToken , options)
    .json(

        new ApiResponse(
            200,
            {
                user : loggedInUser , accessToken , refreshToken
            },
            "User Logged In Successfully"
        )
    )


})




const logoutUser= asyncHandler(async (req,res)=>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )


    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))

})



export {
    registerUser,
    loginUser,
    logoutUser
};