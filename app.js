var express    = require("express"),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	methodOverride = require("method-override"),
	Campground = require("./models/campgrounds"),
	Comment    = require("./models/comments"),
	seedDB     = require("./seeds"),
	session = require('express-session'),
	flash =  require("connect-flash"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User                  = require("./models/user")
	

var	campgroundRouter = require("./routes/campgroundrouter"),
	commentRouter = require("./routes/commentrouter"),
	authRouter = require("./routes/authrouter");


// var url = process.env.DATABASE_URL || 'mongodb://localhost:27017/yelp_camp' 
// console.log(url)
// mongoose.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
mongoose.connect('mongodb+srv://nagashree:iamnagashree@cluster0.68qd8.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


seedDB();

app.set("view engine","ejs");
//__dirname: /workspace/yelpcamp/v5  + /public  
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(session({secret: "Shh, its a one more secret!",
				resave:false,
				saveUninitialized:false,
				}));
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({extended:true}));
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser
())
passport.deserializeUser(User.deserializeUser())
app.use(function(req,res,next){
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(authRouter)
app.use("/campgrounds",campgroundRouter)
app.use("/campgrounds/:id/comments",commentRouter)



app.get("*",function(req,res){
	res.send("sorry!!page not found")
})

app.listen(process.env.PORT || 4000,process.env.IP)
