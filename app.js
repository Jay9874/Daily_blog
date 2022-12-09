// Require all the packages
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require('node:https');
const mongoose = require('mongoose');



// Initializing app
const app = express();


// Connecting the monogDB with creating new db
// mongoose.connect('mongodb://localhost:27017/postsDB');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_KEY}@dailyjournal.uqvpzzm.mongodb.net/postsDB`);

// Set body parser and ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Create empty list for keeping all the Posts
// let posts = [];



// Replacing Array with Database

const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You did give name for post.']
  },
  body: {
    type: String,
    required: [true, 'Give a body of the post.']
  }
})

// Creating model from Schema
const Post = new mongoose.model('Post', postsSchema);


// Render home route with all the posts in db
app.get("/", function(req, res){
  Post.find({}, function(err, foundPosts){
    if(err){
      console.log(err);
    }else {
      res.render("home", {
        posts: foundPosts
        });
    }
  })
});



// Render about view on about route
app.get("/about", function(req, res){
  res.render("about", {});
});


// Render contact view on contact route
app.get("/contact", function(req, res){
  res.render("contact", {});
});


// Render compose view on compose route
app.get("/compose", function(req, res){
  res.render("compose");
});


// Fetching data from compose route
app.post("/compose", function(req, res){
  const post = new Post({
    name: req.body.postTitle,
    body: req.body.postBody
  });
  if(post.name == '' || post.body == ''){
    res.render('error');
  }else {
    post.save();
    res.redirect("/");
  }
});



// // Render data for Read more route, with custom route
app.get("/posts/:postId", function(req, res){
  const postId = req.params.postId;
  Post.findById(postId, function(err, foundPost){
    if(err){
      console.log(err);
    }else {
      res.render('post', {
        title: foundPost.name,
        content: foundPost.body
      })
    }
  });
});



// Listening for get and post request on port 3001
app.listen(process.env.PORT || 3001, function() {
  console.log("Server started on port 3001");
});
