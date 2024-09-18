import { Patient } from "../Models/Patient.model.js";
import { asyncHandler } from "../utils/ApiHandler.js";
import { ApiError } from "../utils/Apierror.js";
import jwt from 'jsonwebtoken'
import { Doctor } from "../Models/Doctor.model.js";
const verifyJwtForPatient = asyncHandler(async (req, res, next) => {
    try {
        const AcessToken = req.cookies?.AcessToken;
        const verifyJwt = jwt.verify(AcessToken, process.env.ACCESS_TOKEN_SECRET)
        const loggedinUser = await Patient.findById(verifyJwt._id);
        if (!loggedinUser) {
            throw new ApiError(401, "token expired")
        }
        req.user = loggedinUser
        next();
    } catch (error) {
        throw new ApiError(401, error.message)
    }
})
const verifyJwtForDoctor = asyncHandler(async (req, res, next) => {
    try {
        const AcessToken = req.cookies?.AcessToken;
        const verifyJwt = jwt.verify(AcessToken, process.env.ACCESS_TOKEN_SECRET)
        const loggedinUser = await Doctor.findById(verifyJwt._id);
        if (!loggedinUser) {
            throw new ApiError("token expired")
        }
        req.user = loggedinUser
        next();
    } catch (error) {
        throw new ApiError(401, error.message)
    }
})
export { verifyJwtForDoctor, verifyJwtForPatient }