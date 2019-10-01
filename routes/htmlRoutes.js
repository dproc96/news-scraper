const db = require("../models");

module.exports = app => {
    app.get("/", (request, response) => {
        db.Article.find({}).populate("comments").then(results => {
            response.render("index", {articles: results})
        }).catch(error => {
            console.log(error);
        })
    })
}