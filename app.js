
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const MONGO_URI = "mongodb+srv://pascgeor:paok1441415336@pascgeor.uc0qj1k.mongodb.net/blogDB"

const PORT = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect(MONGO_URI, {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title : String ,
  content : String
})

const Post = mongoose.model("Post", postSchema)

const infoSchema = new mongoose.Schema({
  name : String,
  content : String
})

const Info = new mongoose.model("Info", infoSchema)



app.get("/",async function(req,res){

  try{
    const postList = await Post.find();

    if (postList.length === 0){
      const homePage = new Post ({
        title: "Welcome to my blog!" ,
        content: "To write a post head over to compose! "
      });
      homePage.save();
      console.log("Successfully created home page");
      res.redirect("/");
    }else{
      res.render("home", {
        posts: postList
      });
    }
  } catch(err){
    console.log(err);
  }
});

app.get("/post/:postID",async function(req,res){

  const postList = await Post.find();

  postList.forEach(function(value){

    const postTitle = value.title;
    const postContent = value.content;
    const postID = req.params.postID;
    if (_.lowerCase(postTitle) === _.lowerCase(postID)){
      res.render("post",{
        valueTitle : postTitle, 
        valueContent : postContent
      })
    }
  })
})

app.get("/about",async function(req,res){
  try{
    const infoList = await Info.findOne({name : "about"});


    if (infoList === null ){
      const about = new Info ({
        name: "about",
        content: "This is the about page"
      })
      about.save();
      console.log("succesfully created about page");
      res.redirect("/about");
    }else{
     
      res.render("about",{aboutFirstParagraph: infoList.content});
    }
  }catch(err){
    console.log(err);
  }
});

app.get("/contact",async function(req,res){

  try{
    const infoList = await Info.findOne({name : "contact"});


    if (infoList === null ){
      const contact = new Info ({
        name: "contact",
        content: "This is the contact page"
      })
      contact.save();
      console.log("succesfully created contact page");
      res.redirect("/contact");
    }else{
     
      res.render("contact",{contactFirstParagraph: infoList.content});
    }
  }catch(err){
    console.log(err);
  }
});

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){
  const post = new Post ({
    title : req.body.newPublishTitle,
    content : req.body.newPublishPost
  })
  post.save()
  res.redirect("/");
})

app.listen(PORT, () => {
  console.log("listening for requests");
})
