import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/ApiHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { Patient } from "../Models/Patient.model.js";
import { Doctor } from "../Models/Doctor.model.js";
import jwt from 'jsonwebtoken'


const GenerateRefreshAndAcessTokenForPatient = async (userId) => {
    try {
        const currUser = await Patient.findById(userId);
        const AccessToken = await currUser.generateAccessToken();
        const RefreshToken = await currUser.generateRefreshToken();
        return { AccessToken, RefreshToken }
    } catch (error) {
        console.log(error);
    }

}
const GenerateRefreshAndAcessTokenForDoctor = async (userId) => {
    try {
        const currUser = await Doctor.findById(userId);
        const AccessToken = await currUser.generateAccessToken();
        const RefreshToken = await currUser.generateRefreshToken();
        return { AccessToken, RefreshToken }
    } catch (error) {
        console.log(error);
    }

}
const RegisterPatient = asyncHandler(async (req, res) => {
    try {
        const { Name, PhoneNumber, Age, Gender, AadharNumber } = req.body;
        //if all the details are present or not
        if (!Name || !PhoneNumber || !Age || !Gender || !AadharNumber) {
            throw new ApiError(402, "Please enter all the details")
        }

        const existingUser = await Patient.findOne({
            AadharNumber
        })
        if (existingUser) {
            throw new ApiError(402, "user already exist");
        }
        if (!['male', 'female', 'transgender'].includes(Gender)) {
            throw new ApiError(402, "gender is not valid")
        }
        const registeredUser = await Patient.create({
            Name: Name,
            PhoneNumber: PhoneNumber,
            Age: Age,
            Gender: Gender,
            AadharNumber: AadharNumber
        });
        return res.status(200).json(
            new ApiResponse("user sucessfully created", 200, registeredUser)
        )
    } catch (error) {
        throw new ApiError(500, error.message);
    }
})
const RegisterDoctor = asyncHandler(async (req, res) => {
    try {
        const { Name, PhoneNumber, Age, Gender, AadharNumber, Imrid } = req.body;
        //if all the details are present or not
        if (!Name || !PhoneNumber || !Age || !Gender || !AadharNumber || !Imrid) {
            throw new ApiError(402, "Please enter all the details")
        }

        const existingUser = await Doctor.findOne({
            AadharNumber
        })
        if (existingUser) {
            throw new ApiError(402, "user already exist");
        }
        if (!['male', 'female', 'transgender'].includes(Gender)) {
            throw new ApiError(402, "gender is not valid")
        }
        const registeredUser = await Doctor.create({
            Name: Name,
            PhoneNumber: PhoneNumber,
            Age: Age,
            Gender: Gender,
            AadharNumber: AadharNumber,
            ImrNumber: Imrid
        });
        return res.status(200).json(
            new ApiResponse("user sucessfully created", 200, registeredUser)
        )
    } catch (error) {
        throw new ApiError(500, error.message);
    }
})
const PatientLogin = asyncHandler(async (req, res) => {
    try {
        const { AadharNumber } = req.body;
        if (!AadharNumber) {
            throw new ApiError(402, "Aadhar number cannot be empty");
        }
        const currUser = await Patient.findOne({ AadharNumber });
        if (!currUser) {
            throw new ApiError(402, "user is not Registered with us");
        }
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { AccessToken, RefreshToken } = await GenerateRefreshAndAcessTokenForPatient(currUser._id);
        currUser.RefreshToken = RefreshToken;
        await currUser.save({ validateBeforeSave: false });
        const loggedinUser = await Patient.findById(currUser._id).select("-RefreshToken")
        return res.status(200)
            .cookie("AcessToken", AccessToken, options)
            .cookie("RefreshToken", RefreshToken, options)
            .json(
                new ApiResponse("user logged in", 200, { loggedinUser, AccessToken, RefreshToken })
            )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})
const DoctorLogin = asyncHandler(async (req, res) => {
    try {
        const { AadharNumber } = req.body;
        if (!AadharNumber) {
            throw new ApiError(402, "Aadhar number cannot be empty");
        }
        const currUser = await Doctor.findOne({ AadharNumber });
        if (!currUser) {
            throw new ApiError(402, "user is not Registered with us");
        }
        const options = {
            httpOnly: true,
            secure: true,
        }
        console.log("in Doctor", currUser)
        const { AccessToken, RefreshToken } = await GenerateRefreshAndAcessTokenForDoctor(currUser._id);
        currUser.RefreshToken = RefreshToken;
        await currUser.save({ validateBeforeSave: false });
        const loggedinUser = await Doctor.findById(currUser._id).select("-RefreshToken")
        return res.status(200)
            .cookie("AcessToken", AccessToken, options)
            .cookie("RefreshToken", RefreshToken, options)
            .json(
                new ApiResponse("user logged in", 200, { loggedinUser, AccessToken, RefreshToken })
            )
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})
const LogoutPatient = asyncHandler(async (req, res) => {
    const loggedinUser = req.user;
    Patient.findByIdAndUpdate(loggedinUser, {
        $set: {
            RefreshToken: undefined
        }
    })
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
        .clearCookie("AcessToken", options)
        .clearCookie("RefreshToken", options)
        .json(
            new ApiResponse("user sucessfully logout", 200, {})
        )
})
const LogoutDoctor = asyncHandler(async (req, res) => {
    const loggedinUser = req.user;
    Doctor.findByIdAndUpdate(loggedinUser, {
        $set: {
            RefreshToken: undefined
        }
    })
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
        .clearCookie("AcessToken", options)
        .clearCookie("RefreshToken", options)
        .json(
            new ApiResponse("successfully logut", 200, {})
        )
})
const RefreshAcessAndRefreshTokenForPatient = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.RefreshToken
    console.log(incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiError(402, "Refresh token expired")
    }
    const verifiedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const currUser = await Patient.findById(verifiedToken._id);
    if (!currUser) {
        throw new ApiError(402, "RefreshToken is Expired")
    }
    console.log("incoming:", incomingRefreshToken)
    console.log("current:", currUser.RefreshToken)
    if (currUser.RefreshToken !== incomingRefreshToken) {
        throw new ApiError(402, "RefreshToken is not valid")
    }
    const { AccessToken, RefreshToken } = await GenerateRefreshAndAcessTokenForPatient(currUser._id)
    currUser.RefreshToken = RefreshToken;
    await currUser.save({ validateBeforeSave: false });
    const newUser = Patient.findById(currUser._id).select("-RefreshToken")
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("AcessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse("tokens Refreshed Sucessfully", 200, { AccessToken, RefreshToken, currUser: newUser })
        )
})
const RefreshAcessAndRefreshTokenForDoctor = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.RefreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(402, "Refresh token expired")
    }
    const verifiedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const currUser = await Doctor.findById(verifiedToken._id);
    if (!currUser) {
        throw new ApiError(402, "RefreshToken is Expired")
    }
    if (currUser.RefreshToken !== incomingRefreshToken) {
        throw new ApiError(402, "RefreshToken is not valid")
    }
    const { AccessToken, RefreshToken } = await GenerateRefreshAndAcessTokenForDoctor(currUser._id)
    currUser.RefreshToken = RefreshToken;
    await currUser.save({ validateBeforeSave: false });
    const newcurrUser = await Doctor.findById(currUser._id).select("-RefreshToken")
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("AcessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse("tokens Refreshed Sucessfully", 200, { AccessToken, RefreshToken, currUser: newcurrUser })
        )
})
const getPhoneNumber = asyncHandler(async (req, res) => {
    const { AadharNumber } = req.body;
    if (!AadharNumber) {
        throw new ApiError(402, "Aadhar number cannot be empty")
    }
    const currUser = await Patient.findOne({ AadharNumber });
    if (!currUser) {
        throw new ApiError(402, "user is not Registered with us");
    }
    return res.status(200).json(
        new ApiResponse("user found", 200, { PhoneNumber: currUser.PhoneNumber })
    )
})
const getPhoneNumberDoc = asyncHandler(async (req, res) => {
    const { AadharNumber } = req.body;
    if (!AadharNumber) {
        throw new ApiError(402, "Aadhar number cannot be empty")
    }
    const currUser = await Doctor.findOne({ AadharNumber });
    if (!currUser) {
        throw new ApiError(402, "user is not Registered with us");
    }
    return res.status(200).json(
        new ApiResponse("user found", 200, { PhoneNumber: currUser.PhoneNumber })
    )
})


export {
    RegisterDoctor, RegisterPatient, LogoutDoctor, LogoutPatient, PatientLogin, DoctorLogin, RefreshAcessAndRefreshTokenForPatient, RefreshAcessAndRefreshTokenForDoctor, getPhoneNumber, getPhoneNumberDoc
}

