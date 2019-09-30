const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    }
})

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;