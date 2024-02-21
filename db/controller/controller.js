const { readTopics, readEndpoints, readArticle, readArticles, readArticleComments, writeArticleComments, addArticleVotes, removeCommentId, readComment} = require(`${__dirname}/../model/model.js`)

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

function getArticles(req, res, next){
    readArticles()
    .then((articles)=>{
        res.status(200).send({articles: articles});
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

function getComment(req, res, next){
    readComment(req)
    .then((comment)=>{
        res.status(200).send({comment: comment})
    })
    .catch(next)
}

function getEndpoints(req, res, next){
    readEndpoints(req)
    .then((endPoints) => {
        res.status(200).send(endPoints);
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

function deleteCommentId(req, res, next){
    removeCommentId(req)
    .then(()=>{
        res.status(204).send()
    })
    .catch(next)
}

module.exports = { getTopics, getArticles, getArticle, getComment, getEndpoints, getArticleComments, postArticleComments, patchArticleVotes, deleteCommentId }