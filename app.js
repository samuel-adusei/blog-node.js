var bodyParser = require("body-parser"),  // Using body parser allows you to access req.body from within your routes, and use that data for example to create a user in a database.
methodOverride = require("method-override"), //  this allows us to ovveride methods like post for delete and put 
expressSanitizer = require("express-sanitizer"),	// this allows us to remove any bad code like an alert javascript which could disrupt our website 
mongoose 	= require("mongoose"),	// this is a cleaner form for us to use for our database
express 	= require ("express"),	// this is what is used to allow us to use the express framework 
app			= express();

mongoose.Promise = global.Promise;	// used to stop a message pop up into our terminal 
mongoose.connect("mongodb://localhost/blog", {useMongoClient: true});	// allows us to have access to mongoose and where we which to store the data
app.set("view engine", "ejs");	//this will allows us to use embedded javascript 
app.use(express.static("public"));	// this will allow us to have access to css files to our data
app.use(bodyParser.urlencoded({extended:true}));	// part of body-parser
app.use(expressSanitizer());	//part of express sanitizer
app.use(methodOverride("_method"));	//part of method ovveride

//First we have to set up our Mongoose / model config on what JSON objects we want to store in our database
var blogsSchema = new mongoose.Schema ({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}	//this allows us to have a date in our file and it being relevant to when we did it 
});
	
var Blog = mongoose.model("Blog", blogsSchema); // this links back to our schema pattern and is needed for us to access it 
	
	// We will being using the RESTFUL routes which is a 7 part system on how to set up your site 
	
	app.get("/", function(req, res){
		console.log("Server is on");
		res.redirect("blogs");	// this is when we access the host it should redirect to the blogs homepage
	});
	
// INDEX ROUTE - This is the inital page for the user
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){	//we use .find({}, this will all us to see all our blogs we post 
       if(err){	// this is the normal format we will take incase of errors and blogs
          console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 	// 
       }
   });
});

// NEW ROUTE - This is the route which will allow 
app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	console.log|(req.body);	//this will show the object of what we created in our formd 
	    Blog.create(req.body.blog, function(err, newBlog){	// the req.body allows us to access our form we created in new.ejs and we called it blog 
        if(err){	
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE - This shows the route for eaach individual id of our blogs 
app.get("/blogs/:id", function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){	//so we used findById so it will look up each id and req.param.id will create a unique pathway for the id for us to use 
			if(err){
				res.redirect("/blogs");	//if it doesnt work  redirect back to homepage
			} else {
				res.render("show", {blog: foundBlog});	// this refers to the name we gave it and an callback function
			}
		})
});

// EDIT ROUTE - This follows the same format of show 
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body) // this req.body.blog.body this is shows u connect with the data
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});

app.listen(3000, function(){
	console.log("BLOG server is on!");
});