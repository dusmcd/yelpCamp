// require statements
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User    = require("./models/user"),
    seedDB = require("./seeds");
//require routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes   = require("./routes/comments"),
    authRoutes      = require("./routes/index");
    

// seedDB();

//configure app
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Picture yourself in a boat on a river",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// current user available for all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//define routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);


// set up server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started.");
});