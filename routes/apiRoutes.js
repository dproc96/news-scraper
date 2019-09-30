const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = ("./models");

module.exports = app => {
    app.post("/scrape", (request, response) => {
        axios.get("https://www.washingtonpost.com/").then(results => {
            const $ = cheerio.load(results.data);
            $(".headline").each((i, element) => {
                const title = $(element).children("a").text();
                const url = $(element).children("a").attr("href");
                let summary = "";
                if ($(element).next().hasClass("blurb")) {
                    summary = $(element).next().text();
                }

                if (title && url) {
                    db.Article.insert({
                        title: title,
                        url: url,
                        summary: summary
                    }).then((error, inserted) => {
                        if (error) {
                            console.log(error);
                            response.status(503).end();
                        }
                        else {
                            console.log(inserted);
                            response.status(200).end();
                        }
                    })
                }
            })
        })
    })

    app.post("/comment/:id", (request, response) => {
        db.Comment.insert(request.body).then((error, comment) => {
            if (error) {
                console.log(error);
            }
            else {
                return db.Article.findOneAndUpdate({ _id: request.params.id }, { $push: { comments: comment._id } }, { new: true }).then((error, user) => {
                    if (error) {
                        console.log(error);
                        response.status(503).end();
                    }
                    else {
                        console.log(user);
                        response.status(200).end();
                    }
                })
            }
        })
    })
}