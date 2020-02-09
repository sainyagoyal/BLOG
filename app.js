var express=require("express");
var mongoose=require("mongoose");
var methodoverride=require("method-override");
var bodyparser=require("body-parser");


mongoose.connect("mongodb://localhost/blog_app");
var app=express();
app.use(bodyparser.urlencoded({extended :true}));
app.use(methodoverride("_method"));

var commentSchema=new mongoose.Schema({
 author:String,
 text:String
});
var comment=mongoose.model("comment",commentSchema);

var blogSchema=new mongoose.Schema({
  title:String,
  image:String,
  content:String,
  comments:[commentSchema]
});
var blog=mongoose.model("blog",blogSchema);


app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
  blog.find({},function(err,blog){
    if(err){
        console.log(err);
    }
    else{
      console.log(blog);
        res.render("home.ejs",{blog:blog});
    }
  });
});

app.get("/blogs/new",function(req,res){
  res.render("new.ejs");
});


app.post("/blogs",function(req,res){
var title=req.body.title;
var content=req.body.content;
var image=req.body.image;

var newblog=({title:title,content:content,image:image});
blog.create(newblog,function(err,newcreate){
  if(err){
    console.log(err);
  }else{
    res.redirect("/blogs");
  }
});
});

app.get("/blogs/:id",function(req,res){
  blog.findById(req.params.id,function(err,blog){
    if(err){
      console.log(err);
    }
    else{
      res.render("show.ejs",{blog:blog});
    }
  });
});

app.get("/blogs/:id/edit",function(req,res){
  blog.findById(req.params.id,function(err,blog){
    if(err){
      console.log(err);
    }
    else{
      res.render("edit.ejs",{blog:blog});
    }
  });
});

app.put("/blogs/:id",function(req,res){
  var title=req.body.title;
  var content=req.body.content;

  var newblog=({title:title,content:content});
  blog.findByIdAndUpdate(req.params.id,newblog,function(err,blog){
    if(err)
      console.log(err);
    else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});
app.delete("/blogs/:id",function(req,res){
  blog.findByIdAndRemove(req.params.id,function(){
    res.redirect("/blogs");
  });
});

app.post("/blogs/:id",function(req,res){
  blog.findById(req.params.id,function(err,selectedBlog){
    if(err)
      console.log(err);
    else
    {
      selectedBlog.comments.push({author:req.body.author,
                                text:req.body.text
      });
      selectedBlog.save(function(err,blog){
        if(err)
          console.log(err);
        else
          res.redirect("/blogs/"+req.params.id);
      })
    }
  });
});
  app.listen(5000,function(){
  console.log("port 5000 started!");
});
