import { User } from "../model/user.model.js";

//! Utils Imports
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};


const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400 , "User not found...")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return { accessToken , refreshToken}
}

const registerUser = asyncHandler(async (req , res) => {
    const { name , email , password } = req.body;
    if(!name || !email || !password){
        throw new ApiError(400 , "Fill all the fields...");
    }

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(400 , "User with this email already exists...")
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const { accessToken , refreshToken } = generateAccessAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select(" -password -refreshToken ");
    if(!createdUser){
        throw new ApiError(400 , "Something went wrong while creating user...")
    }

    return res.status(200)
            .cookie("accessToken" , accessToken , cookieOptions)
            .cookie("refreshToken" , refreshToken , cookieOptions)
            .json(new ApiResponse(201 , { user : createdUser} , "User Created Successfully..."))
});

const loginUser = asyncHandler(async (req , res) => {
    const {email , password} = req.body;
    if(!email || !password){
        throw new ApiError(400 , "Fill all the fields...");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400 , "User with this email does not exists...")
    }

    const checkPassword = await user.isPasswordCorrect(password)
    if(!checkPassword){
        throw new ApiError(400 , "Incorrect Password...");
    }

    const { accessToken , refreshToken } = generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")
    if(!logedInUser){
        throw new ApiError(400 , "Login Failed...");
    }    

     return res.status(200)
            .cookie("accessToken" , accessToken , cookieOptions)
            .cookie("refreshToken" , refreshToken , cookieOptions)
            .json(new ApiResponse(200 , { user : loggedInUser} , "User Log In Successfully..."))
})

export { registerUser }