const express = require("express");
const cors = require('cors');
const app = express();
const { getTopics, getArticles, getArticle, getComment, getUsers, getUser, getEndpoints, getArticleComments, postArticleComments, postTopics, postArticles, patchArticleVotes, patchCommentVotes, deleteCommentId, deleteArticleId } = require(`${__dirname}/controller/controller.js`);
const {handleCustomErrors, handlePsqlErrors} = require(`${__dirname}/controller/error.controller.js`);

app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/comments/:comment_id", getComment);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUser);
app.get("/api", getEndpoints);
app.post("/api/articles/:article_id/comments", postArticleComments);
app.post("/api/topics", postTopics);
app.post("/api/articles", postArticles);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.patch("/api/comments/:comment_id", patchCommentVotes);
app.delete("/api/comments/:comment_id", deleteCommentId);
app.delete("/api/articles/:article_id", deleteArticleId);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);

module.exports = app;