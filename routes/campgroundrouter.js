
var express    = require("express"),
	router = express.Router(),
	Campground     = require("../models/campgrounds"),
	Comment     = require("../models/comments"),
	middleware = require("../middleware")//index.js is a special name

	// app        = express(),
	// mongoose   = require("mongoose"),
	// passport = require("passport"),
	// localStrategy = require("passport-local"),
	// passportLocalMongoose = require("passport-local-mongoose"),
	// User                  = require("../models/user"),
	
	// Comments = require("../models/comments");


router.get("/",function(req,res){
	//console.log(req.user)
	
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/campgrounds",{campgrounds:allcampgrounds});
		}
	})
		
})

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new")
})

router.post("/",middleware.isLoggedIn,function(req,res){
	console.log(req.user)
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var price = req.body.price
	var author = {
		id: req.user._id,
		username:req.user.username
	}
	var newcampground = {name:name, image:image,price:price, description:description,author:author}
	Campground.create(newcampground, function(err,campground){
	if(err){
		req.flash("error","something went wrong")
		console.log(err)
	}else{
		req.flash("success","campground is created successfully")
		res.redirect("/campgrounds")
	}
});


	
})

router.get("/:id",middleware.isLoggedIn,function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			console.log(campground);
			res.render("campgrounds/show",{campground:campground});
		}
	})
	
})
//edit route

router.get("/:id/edit",middleware.ckeckcampgroundsownership,function(req,res){
	Campground.findById(req.params.id,function(err,foundcampground){
			res.render("campgrounds/edit",{campground:foundcampground})
		})
})

//update route

router.put("/:id",middleware.ckeckcampgroundsownership,function(req,res){
	//req.body.blog.body=req.sanitize(req.body.blog.body)
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//Destroy route
router.delete("/:id",middleware.ckeckcampgroundsownership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds")
		}
	})
})


//check logged in and own it

module.exports = router