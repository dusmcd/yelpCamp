var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground");

//index route
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
        
});
//new route
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
//create route
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
        campground.author.id = req.user._id;
        campground.author.username = req.user.username;
        campground.save();
        res.redirect("/campgrounds");
        }
    });
    
    
});
//edit
router.get("/:id/edit", isOriginalUser, function(req, res) {
    Campground.findById(req.params.id, function(err, shownCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: shownCampground});
        }
    });
});
//update
router.put("/:id", isOriginalUser, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
            // console.log(updatedCampground);
        }
    });
});
//destroy
router.delete("/:id", isOriginalUser, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
//show
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, shownCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(shownCampground);
            res.render("campgrounds/show", {campground: shownCampground});
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isOriginalUser(req, res, next) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            if (req.user !== undefined && String(req.user._id) === String(campground.author.id)) {
                return next();
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
}

module.exports = router;