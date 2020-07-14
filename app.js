//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const path = require("path");

const homeStartingContent = "A journal, from the Old French journal (meaning - daily), may refer to several things. In its original meaning, it refers to a daily record of activities, but the term has evolved to mean any record of activities, regardless of time elapsed between entries such as dairy, daybook, logbook, transaction journal, magazine , etc...";
const aboutContent = "This website provide you a very safe and friendly environment for putting your daily thoughts so that you can review them to see your growth in something or might be helpful as a hobby .The data you compose as your thoughts is safe in this user friendly environment.";
const contactContent= "";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true , useUnifiedTopology: true});
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/postcompose");
    }
  });
});
app.get("/postcompose", function(req, res){
  res.render("postcompose");
});
app.post("/postcompose", function(req, res){
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
