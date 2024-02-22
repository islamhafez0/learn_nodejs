const mongoose = require("mongoose");
const Scheme = mongoose.Schema;


const articleSchema = new Scheme({
    title: String,
    body: String,
    likes: Number,
});


const Article = mongoose.model("Article", articleSchema)

module.exports = Article;