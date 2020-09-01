var express    = require("express"),
	router = express.Router(),
	passport = require("passport"),
	// mongoose   = require("mongoose"),
	// localStrategy = require("passport-local"),
	// passportLocalMongoose = require("passport-local-mongoose");
	User                  = require("../models/user")


router.get("/",function(req,res){
	res.render("landing")
})


router.get("/register",function(req,res){
	res.render("register")
})
router.post("/register",function(req,res){

	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){	
			console.log(err)
			req.flash("error",err.message)
			return res.redirect("/register")
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","successfully logged in,welcome to campgrounds " + user.username)
				res.redirect("/campgrounds");
			})
		}
	})
})


router.get("/login",function(req,res){
	res.render("login")
})
router.post("/login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login"}), function(req,res){

})


router.get("/logout",function(req,res){
	req.logout()
	req.flash("success","successfully logged you out")
	res.redirect("/campgrounds")
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}
module.exports = router
