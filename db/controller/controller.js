const { readTopics, readEndpoints, readArticle, readArticles, readArticleComments, writeArticleComments, addArticleVotes, removeCommentId, readComment, readUsers, readUser, addCommentVotes, writeTopics, writeArticles, removeArticleId } = require(`${__dirname}/../model/model.js`)

function getTopics(req, res, next){
    readTopics()
    .then((topics) => {
        const topicsResponse = {
            topics: topics
        }
        res.status(200).send(topicsResponse);
    })
    .catch(next);
}

function getArticles(req, res, next){
    readArticles(req)
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
        res.status(200).send({comment: comment});
    })
    .catch(next);
}

function getUsers(req, res, next){
    readUsers()
    .then((users)=>{
        res.status(200).send({users: users});
    })
    .catch(next);
}

function getUser(req, res, next){
    readUser(req)
    .then((user)=>{
        res.status(200).send({user: user});
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
    .catch(next);
}

function postTopics(req, res, next){
    writeTopics(req)
    .then((topic)=>{
        res.status(201).send({topic: topic});
    })
    .catch(next);
}

function postArticles(req, res, next){
    writeArticles(req)
    .then((article)=>{
        res.status(201).send({article: article});
    })
    .catch(next);
}

function patchArticleVotes(req, res, next){
    addArticleVotes(req)
    .then((article)=>{
        res.status(200).send({article: article});
    })
    .catch(next);
}

function patchCommentVotes(req,res,next){
    addCommentVotes(req)
    .then((comment)=>{
        res.status(200).send({comment: comment});
    })
    .catch(next);
}

function deleteCommentId(req, res, next){
    removeCommentId(req)
    .then(()=>{
        res.status(204).send()
    })
    .catch(next);
}

function deleteArticleId(req, res, next){
    removeArticleId(req)
    .then(()=>{
        res.status(204).send()
    })
    .catch(next);
}

module.exports = { getTopics, getArticles, getArticle, getComment, getUsers, getUser, getEndpoints, getArticleComments, postArticleComments, postTopics, postArticles, patchArticleVotes, patchCommentVotes, deleteCommentId, deleteArticleId }