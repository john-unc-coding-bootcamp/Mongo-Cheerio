const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Note schema...
var CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    articleId: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
