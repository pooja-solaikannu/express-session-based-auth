import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import * as dotenv from "dotenv";
dotenv.config();

const app = express()

interface User {
    _id: Number
    username: string
    password: string
}

// In Memory dummy User table entry
const users: User[] = []

app.use(express.json())
app.use(session({
  secret: 'foo',
  store: MongoStore.create({ mongoUrl: process.env.MONGOOSE_DATABASE_URL as string })
}));

app.get("/", (req, res) => {

    //@ts-ignore
    if (!req.session.user) {
        res.status(403).json({
            message: "User need to authenticate"
        })
        return;
    }
    res.status(200).json({
        //@ts-ignore
        message: `Health check for ${req.session.user}`
    })
})

app.post("/signup", (req, res) => {

    console.log("Signup end point")
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password
    
    // Zob validation is must
    users.push({
        _id: 1,
        username: username,
        password: password
    })
    
    res.status(200).json({
        message: "you are signed up"
    })
})


app.post("/signin", (req, res) => {

    const username = req.body.username
    const password = req.body.password

    const userFound = users.find((x) => x.username === username && x.password === password)

    //@ts-ignore
    req.session.user = userFound?._id
    
    res.status(200).json({
        message: "you are signed in. check the session table for user id"
    })
})


app.listen(process.env.PORT)