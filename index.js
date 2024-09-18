
import express from 'express'
import { app } from './app.js';
import DbConnect from './src/Db/DbConnect.js';
const PORT = process.env.PORT || 8080
DbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app is listening on ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
        console.log("connection failed!!!!!")
    })