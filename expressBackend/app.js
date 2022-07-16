// author: Precious Affiah 2022
// hi guys, this is the documentation for my backend for the article/blog app
// if you notice there are some packages i installed and did'nt use i thought i will need them for future purposes when i decide to extend the features of the app, enjoy!!!!

const express = require("express");
const app = express();
const UserRouter = require("./api/userApi")
const res = require("express/lib/response");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require("./connection");


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.use(session({secret: 'shhhhh', saveUninitialized: true,resave: true}));
app.use(cookieParser());

app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET", "PUT", "DELETE"],
    })
);

app.use(bodyParser.json({limit:"5mb"}));
app.use(bodyParser.urlencoded({extended: false}));

app.use("/user", UserRouter);

app.listen(3000, () =>{
    console.log("listening to port 3000");
})