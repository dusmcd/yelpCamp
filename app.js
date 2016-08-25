var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
    name: "Granite Hills",
    image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"
}, function(err, campground) {
    if(err) {
        console.log("SOMETHING WENT WRONG.");
    }
    else {
        console.log("NEW CAMPGROUND CREATED: ");
        console.log(campground);
    }
});

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {

        
    // res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    
    // campgrounds.push(newCampground);
    res.redirect("/campgrounds");
    
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started.");
});