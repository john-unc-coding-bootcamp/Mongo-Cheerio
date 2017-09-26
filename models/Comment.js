const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create the Note schema...
var CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Note;
