const express = require("express");
const app = express();
const { getTopics, getArticles, getArticle, getComment, getEndpoints, getArticleComments, postArticleComments, patchArticleVotes, deleteCommentId} = require(`${__dirname}/controller/controller.js`);
const {handleCustomErrors, handlePsqlErrors} = require(`${__dirname}/controller/error.controller.js`);

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/comments/:comment_id", getComment);
app.get("/api", getEndpoints);
app.post("/api/articles/:article_id/comments", postArticleComments);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentId);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);


module.exports = app;