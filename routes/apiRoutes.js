const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = app => {
    app.post("/scrape", (request, response) => {
        axios.get("https://www.washingtonpost.com/").then(results => {
            const $ = cheerio.load(results.data);
            db.Article.deleteMany({}, () => {
                $(".headline").each((i, element) => {
                    const title = $(element).children("a").text();
                    const url = $(element).children("a").attr("href");
                    let summary = "";
                    if ($(element).next().hasClass("blurb")) {
                        summary = $(element).next().text();
                    }
    
                    if (title && url && summary) {
                        db.Article.create({
                            title: title,
                            url: url,
                            summary: summary
                        }).then((error, inserted) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log(inserted);
                                response.status(200).end();
                            }
                        })
                    }
                })
                response.status(200).end();
            });
        }).catch(error => {
            console.log(error)
        })
    })

    app.post("/comment/:id", (request, response) => {
        db.Comment.create(request.body).then((comment, error) => {
            if (error) {
                console.log(error);
            }
            else {
                db.Article.findOneAndUpdate({ _id: request.params.id }, { $push: { comments: comment._id } }, { new: true }).then((article, error) => {
                    if (error) {
                        console.log(error);
                        response.status(503).end();
                    }
                    else {
                        console.log(article);
                        response.status(200).end();
                    }
                })
            }
        })
    })
}