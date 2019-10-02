const db = require("../models");

module.exports = app => {
    app.get("/", (request, response) => {
        db.Article.find({}).then(results => {
            response.render("index", {articles: results})
        }).catch(error => {
            console.log(error);
        })
    })
    app.get("/articles/:id", (request, response) => {
        db.Article.find({_id: request.params.id}).populate("comments").then(results => {
            console.log(results)
            response.render("article", { article: results[0] })
        }).catch(error => {
            console.log(error);
        })
    })
}