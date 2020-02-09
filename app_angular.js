var express=require("express");
var mongoose=require("mongoose");
var methodoverride=require("method-override");
var bodyparser=require("body-parser");



mongoose.connect("mongodb://localhost/blog_app");
var app=express();
app.use(bodyparser.urlencoded({extended :true}));
app.use(methodoverride("_method"));

app.use(bodyparser.json());
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials','http://localhost:4200', true);
    res.setHeader('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    next();
    });

//var commentSchema=new mongoose.Schema({
//  author:String,
//  text:String
//});
//var comment=mongoose.model("comment",commentSchema);

var blogSchema=new mongoose.Schema({
  title:String,
  content:String,
  description:String,
  //comments:[commentSchema]
})
var blog=mongoose.model("blog",blogSchema);
//
// blog.create({title:"my desk setup",content:"i love my desk setup.It's awesome!"});
// blog.create({title:"send help",content:"please help!"});
//var comment1=comment.create({author:"sainya",text:"gooooooooood one!"});
// blog.findOne({title:"send help"},function(err,blog){
//   if(err){
//   //  console.log(err);
//   }else{
//     console.log("foundddddddd");
//     console.log(blog);
//     blog.comments.push({author:"sainya",text:"gooooooooood one!"});
//     blog.save(function(err,blog){
//       if(err){
//         console.log(err);
//       }
//       else{
//         console.log(blog);
//       }
//     });
//   }
// })

app.get("/blogs",function(req,res){
  blog.find({},function(err,blog){
    if(err){
        console.log(err);
    }
    else{
      console.log(blog);
        res.render("home.ejs",{blog:blog});
    }
  })
})

app.get("/blogs/new",function(req,res){
  res.render("new.ejs");
});


app.post("/blogs",function(req,res){
var title=req.body.title;
var content=req.body.content;
var description=req.body.description;
var newblog=({title:title,content:content,description:description});
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
  })
})

app.get("/blogs/:id/edit",function(req,res){
  blog.findById(req.params.id,function(err,blog){
    if(err){
      console.log(err);
    }
    else{
      res.render("edit.ejs",{blog:blog});
    }
  })
})

app.put("/blogs/:id",function(req,res){
  var title=req.body.title;
  var content=req.body.content;
  var description=req.body.description;
  var newblog=({title:title,content:content,description:description});
  blog.findByIdAndUpdate(req.params.id,newblog,function(err,blog){
    if(err)
      console.log(err);
    else{
      res.redirect("/blogs/"+req.params.id);
    }
  })
})
app.delete("/blogs/:id",function(req,res){
  blog.findByIdAndRemove(req.params.id,function(){
    res.redirect("/blogs");
  })
})
  app.listen(5000,function(){
  console.log("port 5000 started!");
});
