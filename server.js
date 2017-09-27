// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const logger = require("morgan");
// Requiring our Note and Article models
const Comment = require("./models/Comment.js");
const Article = require("./models/Article.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/info-scrapes");
const db = mongoose.connection;

// Show any mongoose errors
db.on("error", (error) => {
    console.log("Mongoose Error: ", error);
});

// TODO: remove
// Once logged in to the db through mongoose, log a success message
db.once("open", () => {
    console.log("Mongoose connection successful.");
});

// Routes
app.get("/api/v1/scrape", (req, res) => {
    
    request("https://www.infowars.com/category/us-news/", (error, response, html) => {
        
        const $ = cheerio.load(html);
        Article.find({}, function(error, articles) {
            // For each article...
            $(".article-content").each((i, element) => {

                // Get headline, summary, and link...
                const result = {};
                result.headline = $(element).children("h3").text();
                result.summary =  $(element).children("h4").text();
                result.URL = $(element).children("h3").children("a").attr("href");

                // Check for duplicate
                var unique = true;
                for (i=0; i<articles.length; i++) {
                    if (result.headline == articles[i].headline)
                        unique = false;
                }
                
                if (unique) {
                    // Make into an Article object
                    const article = new Article(result);

                    // Save to mongo
                    article.save((err, doc) => {
                        if (err) { console.log(err); } 
                        else { console.log(doc); }
                    });
                }
            });
        });
    });
});

app.get("/api/v1/articles", function(req, res) {
    // Get every article...
    Article.find({}, function(error, doc) {
        if (error) { console.log(error); }
        else { res.json(doc); }
    });
});

app.post("/api/v1/comment", commentData, () => {
    
    const comment = new Comment(commentData);

    // Save to mongo
    comment.save((err, doc) => {
        if (err) { console.log(err); } 
        else { console.log(doc); }
    });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
