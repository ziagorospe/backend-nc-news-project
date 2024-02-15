const express = require("express");
const app = express();
const { getTopics } = require(`${__dirname}/controller/controller.js`)
const {handleCustomErrors, handlePsqlErrors} = require(`${__dirname}/controller/error.controller.js`)

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;