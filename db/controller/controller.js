const { readTopics, readEndpoints, readArticle, readArticles, readArticleComments, writeArticleComments, addArticleVotes} = require(`${__dirname}/../model/model.js`)

function getTopics(req, res, next){
    readTopics(req)
    .then((topics) => {
        const topicsResponse = {
            topics: topics
        }
        res.status(200).send(topicsResponse);
    })
    .catch(next);
}

function getEndpoints(req, res, next){
    readEndpoints(req)
    .then((endPoints) => {
        res.status(200).send(endPoints);
    })
    .catch(next);  
}

function getArticle(req, res, next){
    readArticle(req)
    .then((article)=>{
        res.status(200).send({article: article});
    })
    .catch(next);
}

function getArticles(req, res, next){
    readArticles()
    .then((articles)=>{
        res.status(200).send({articles: articles});
    })
    .catch(next);
}

function getArticleComments(req, res, next){
    readArticleComments(req)
    .then((articleComments)=>{
        res.status(200).send({articleComments: articleComments});
    })
    .catch(next);
}

function postArticleComments(req, res, next){
    writeArticleComments(req)
    .then((articleComment)=>{
        res.status(201).send({articleComment: articleComment});
    })
    .catch(next)
}

function patchArticleVotes(req, res, next){
    addArticleVotes(req)
    .then((article)=>{
        res.status(200).send({article: article});
    })
    .catch(next)
}

module.exports = { getTopics, getEndpoints, getArticle, getArticles, getArticleComments, postArticleComments, patchArticleVotes }