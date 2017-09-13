var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {   name: "Granite Flats",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
        description: "I don't know"
    },
    {   name: "Beach Bums",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "I don't know"
    },
    {   name: "The Forest",
        image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg",
        description: "I don't know"
    }
    ];


function seedDB() {
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("all campgrounds removed");
        data.forEach(function(seed) {
            Campground.create(seed, function(err, createdCampground) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("new campground created");
                    Comment.create({
                        text: "This place is awesome! It is the best camping place ever!",
                        author: "Anonymous"
                    }, function(err, comment) {
                        if(err) {
                            console.log(err);
                        } else {
                            createdCampground.comments.push(comment);
                            createdCampground.save();
                            console.log("created new comment");
                        }
                    });
                }
            });
        });
    });
}


module.exports = seedDB;