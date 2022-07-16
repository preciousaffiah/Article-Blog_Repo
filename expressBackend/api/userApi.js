// author: Precious Affiah 2022
// hi guys, this is the documentation for my backend for the article/blog app
// if you notice there are some packages i installed and did'nt use i thought i will need them for future purposes when i decide to extend the features of the app, enjoy!!!!

//packages i used
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Article = require("../models/articleModel");

//packages i did not use
const multer = require("multer");
const cloudinary = require("../images/imageUpload");
const session = require("express-session");
const cookieParser = require("cookie-parser");


//i honestly don't know what this lines(line 20-28) of code means
var sess;
router.get("/", (req, res) => {

    sess = req.session;
    if (sess.email) {
        return res.redirect("/admin");
    }
    res.sendFile("index.html");
});

//register route(http://localhost:3000/user/register)
//when a user registers with their email this function checks if the email already exists, if so it'll throw an error else the users email will be registered and password will be hashed
router.post("/register", async (req, res) => {
    const { name, email, password, phone_number, address } = req.body;
    User.find({ email: email }).then((result) => {
      if (result.length != 0) {
        res.json({
          status: "EMAIL",
          message: "This Email Already Exist",
        });
      } else {
        try {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then(async (hashedPassword) => {
              const newPost = await User.create({
                name,
                email,
                password: hashedPassword,
                phone_number,
                address,
              });
  
              res.status(200);
              res.json({
                status: "SUCCESS",
                message: newPost,
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: err,
              });
            });
        } catch (error) {
          res.status(500).send(error);
        }
      }
    });
  });

//login route(http://localhost:3000/user/login)
//when a user logs in with their email and password, this function checks if the users email inputed is in the database if it is it will check the database for the hashed password with the coresponding email and unhash it and then check if the unhashed password from the database matches the users inputed password anything other than this will throw an error message or status
  router.post("/login", async(req, res) =>{
      const {email, password} = req.body;

      User.find({email: email}).then((result) => {
          if (result.length != 0){
              const hashedPassword = result[0].password;

              bcrypt.compare(password, hashedPassword).then((trueOrNot) =>{
                  if (trueOrNot) {
                      res.json({
                          status: "SUCCESS",
                          message: "Login successful",
                          data: result
                      });
                  } else {
                      res.json({
                          status: "FAILED",
                          message: "Wrong password",
                        });
                  }
              });
          } else{
              res.json({
                  status: "EMAIL",
                  message: "email does not exist please register",
              });
          }
      });
  });

//login route(http://localhost:3000/user/getUser)
//when a user is registered a unique id is assigned in the database
//no id is the same, all id's are different no matter what
//this route/function uses a users id from the request body and gives you the users data
  router.post("/getUser/", (req, res) => {
    const { id } = req.body;
    User.find({ _id: id }).then((result) => {
      if (!result) {
        res.status(404);
        res.send("id is wrong");
        // id does not exist
      } else {
        res.json({
          status: "SUCCESS",
          message: result,
        });
      }
    });
  });

//i honestly don't fully understand what this lines(line 127-147) of code means
  router.get("/jwt/:id", (req, res) => {
    const token = jwt.sign({ _id: req.params.id }, process.env.TOKEN_SECRET, {
      expiresIn: "2678400s",
    });
    // res.send(token);
    res.header("auth-token", token).send(token);
  });
  
  router.post("/confirmJwt/", (req, res) => {
    const token = req.body.auth;
    if (!token) return res.status(401).send("ACCESS DENIED");
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      // req.user = verified;
      res.send(verified);

    } catch (error) {
      res.send("Invalid Token");
    }
  });

//login route(http://localhost:3000/user/publisharticle)
// this function gets the date created,topic,category, of the article and text.user_id from the request body and puts it into the database of the particular user using the user_id aka id and in the login/register route and a unique id will be assigned to each article that is being published in the database
  router.post("/publisharticle", async (req, res) => {
    const {
      created,
      topic,
      category,
      text,
      user_id,
    } = req.body;
  
    try {

      const newPost = await Article.create({
      created,
      topic,
      category,
      text,
      user_id,
      });
  
      res.status(200);
      res.json({
        status: "SUCCESS",
        message: newPost,
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: "FAILED",
        message: err,
      });
    }
  });

//login route(http://localhost:3000/user/allArticles)
//this funtion/route gets all the articles in the Article database
  router.get("/allArticles/", async (req, res) => {
    Article.find().then((result) => {
      res.json({
        status: "SUCCESS",
        message: result,
      });
    });
  });

//login route(http://localhost:3000/user/myarticle/any_users_id)
//this function/route uses the users id in the parameter to get all the articles published under the user with such id
//if such an id does not exist and error message/status will be thrown
  router.get("/myarticle/:id", async (req, res) => {
    const { id } = req.params;
    Article.find({ user_id: id }).then((result) => {
      res.json({
        status: "SUCCESS",
        message: result,
      });
    });
  });

//login route(http://localhost:3000/user/uniquearticle/any_article_id)
// this function/route uses the unique article id to get the data for the article with such id 
//if the id does not exist an error message/status will be thrown
  router.get("/uniquearticle/:id", async (req, res) => {
  const { id } = req.params;
  Article.findOne({_id: id }).then((result) => {
    if (!result) {
      res.json({
        status: "FAILED",
      //article does not exist
      });
    } else {
      res.json({
        status: "SUCCESS",
        message: result,
      });
    }
  });
});

module.exports = router;