import express from 'express'

import mongoose from 'mongoose'
const DbConnect=async ()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
       console.log('mongodb connected',connectionInstance.connection.host)
    } catch (error) {
        console.log('error',error)
        throw error
    }
}
export default DbConnect;