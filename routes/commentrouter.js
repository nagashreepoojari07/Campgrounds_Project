var express    = require("express"),
	router = express.Router({mergeParams: true}),
	//mongoose   = require("mongoose"),
	// passport = require("passport"),
	// localStrategy = require("passport-local"),
	// passportLocalMongoose = require("passport-local-mongoose"),
	Campground = require("../models/campgrounds"),
	Comment = require("../models/comments"),
	User                  = require("../models/user"),
	middleware = require("../middleware")



router.get("/new",middleware.isLoggedIn,function(req,res){
	//console.log(req.params.id)
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			//console.log(campground);
			res.render("comments/new",{campground:campground});
		}
	})
	
})

router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			console.log(campground);
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err)
				}else{
					console.log(req.user.username)
					
					comment.author.id=req.user._id
					comment.author.username=req.user.username
					comment.save()
					console.log(comment.author.username)
					campground.comments.push(comment)
					campground.save()
					console.log(comment)
					res.redirect("/campgrounds/" +campground._id);
				}
			})
			
		}
	})
})

router.get("/:comment_id/edit",middleware.ckeckcommentsownership,function(req,res){
	console.log("edit=" + req.params.comment_id)
	Comment.findById(req.params.comment_id,function(err,foundComment){
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
		})
})

router.put("/:comment_id",middleware.ckeckcommentsownership,function(req,res){
	//req.body.blog.body=req.sanitize(req.body.blog.body)
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})


router.delete("/:comment_id",middleware.ckeckcommentsownership,function(req,res){
	console.log("delete=" + req.params.comment_id)
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})


module.exports = router
