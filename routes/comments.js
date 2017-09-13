var express = require("express"),
    router = express.Router({mergeParams: true}), //enables the id to be passed to comments form
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// new comments
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});
//create comments
router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", isCommentAuthor, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

router.put("/:comment_id", isCommentAuthor, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", isCommentAuthor, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err); 
        } else {
            res.redirect("back");
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
            if(req.user._id === campground.author.id) {
                return next();
            }
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
}

function isCommentAuthor(req, res, next) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            console.log(err);
        } else {
            if(req.user !== undefined && String(req.user._id) === String(comment.author.id)) {
                return next();
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
}
module.exports = router;
