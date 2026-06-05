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

const logoutUser = asyncHandler(async (req ,res) => {
    await User.findByIdAndUpdate(req.user._id ,{
        $set : {
            refreshToken : undefined
        }
    } , {
        new : true
    })

    return res.status(200)
        .clearCookie("accessToken" , clearCookieOptions)
        .clearCookie("refreshToken" , clearCookieOptions)
        .json(new ApiResponse(200 , {} , "User logged Out successfully..."))
});

const currentUser = asyncHandler(async (req , res) => {
    const user = req.user;
      return res.status(200)
            .json(new ApiResponse(200 , {user : user} , "Current user fetched successfully..."))
}) 

const refreshAccessToken = asyncHandler(async (req , res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401 , "Unauthorized Request...")
    }

    try{
        const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)
        if (!user) {
      throw new ApiError(401, "Invalid request token...");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired...");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token is refreshed successfully...",
        ),
      );
    }catch(error){
        if (error instanceof ApiError) {
          throw error;
        }
        if (error.name === "TokenExpiredError") {
          throw new ApiError(401, "Refresh Token is expired...");
        }
        if (error.name === "JsonWebTokenError") {
          throw new ApiError(401, "Invalid refresh token...");
        }
        throw new ApiError(401, "Unable to refresh access token...");
    }
});

export { registerUser, loginUser , logoutUser , currentUser , refreshAccessToken, updateProfile };