import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const PatientSchema = new Schema(
    {
        Name: {
            type: String,
            required: true,
        },

        PhoneNumber: {
            type: String,
            required: true,

        },
        Age: {
            type: Number,
            required: true
        },
        Gender: {
            type: String,
            enum: ['male', 'female', 'transgender'],
            required: true
        },
        AadharNumber: {
            type: String,
            required: true,
            unique: true
        },
        RefreshToken: {
            type: String
        },
        isDoctor: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    })
PatientSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            Name: this.Name,
            PhoneNumber: this.PhoneNumber,
            Age: this.Age,
            Gender: this.Gender,
            AadharNumber: this.AadharNumber,
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}
PatientSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const Patient = mongoose.model('Patient', PatientSchema)