const express = require("express");
const app = express();
const { getTopics, getEndpoints, getArticle, getArticles, getArticleComments, postArticleComments} = require(`${__dirname}/controller/controller.js`);
const {handleCustomErrors, handlePsqlErrors} = require(`${__dirname}/controller/error.controller.js`);

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/articles/:article_id", getArticle);
app.get("/api", getEndpoints);
app.post("/api/articles/:article_id/comments", postArticleComments);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);


module.exports = app;