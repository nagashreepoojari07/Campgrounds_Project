var Campground = require("../models/campgrounds")
var Comment = require("../models/comments")

var middlewareObj = {}

middlewareObj.ckeckcampgroundsownership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundcampground){
				if(err){
					res.redirect("back")
				}else{
					//does user own the campgrounds
					console.log(foundcampground.author.id) //is a object
					console.log(req.user._id)  //is a string
					if(foundcampground.author.id.equals(req.user._id)){
						next()
					}else{
						req.flash("error","you dont have permission to do that")
						res.redirect("back")
						}					
					}
			})
	}else{
		req.flash("error","you need to be logged in to do that")
		res.redirect("back")
		}	
}
middlewareObj.ckeckcommentsownership = function(req,res,next){
	if(req.isAuthenticated()){
		
		Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err){
					res.redirect("back")
				}else{
					//does user own the campgrounds
					//is a string
					console.log(foundComment)
					if(foundComment.author.id.equals(req.user._id)){
						next()
					}else{
						req.flash("error","you dont have permission to do that")
						res.redirect("back")
						}					
					}
			})
	}else{
		req.flash("error","you need to be logged in to do that")
		res.redirect("back")
		}	
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","you need to be logged in to do that!")
	res.redirect("/login")
}



module.exports = middlewareObj