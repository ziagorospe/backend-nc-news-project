const db = require(`${__dirname}/../connection.js`);
const fs = require('fs/promises');

function readTopics(){
    const queryString = `SELECT * FROM topics;`;
    return db.query(queryString)
    .then((data)=>{
        return data.rows;
    })
}

function readEndpoints(){
    return fs.readFile(`${__dirname}/../../endpoints.json`)
    .then((data)=>{
        const parsedData = JSON.parse(data);
        return parsedData;
    })
}

function readArticle(req){
    const articleId = req.params.article_id;
    const queryString = `SELECT * FROM articles WHERE articles.article_id = $1;`;
    return db.query(queryString, [articleId])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article not found'});
        }
        return data.rows[0];
    })
}

function readArticles(){
    const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;
    return db.query(queryString)
    .then((data)=>{
        return data.rows;
    })
}

function readArticleComments(req){
    const articleId = req.params.article_id;
    const queryString = `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`;
    return Promise.all([db.query(queryString, [articleId]), fetchArticleIds()])
    .then((data)=>{
        if(data[0].rows.length === 0){
            if(!data[1].includes(articleId*1)){
                return Promise.reject({status: 404, msg: 'article not found'});
            } else {
                return Promise.reject({status: 200, msg: 'no comments found :('});
            }
        }
        return data[0].rows;
    })
}   

function readComment(req){
    const commentId = req.params.comment_id;
    const queryString = `SELECT * FROM comments WHERE comment_id = $1;`;
    return db.query(queryString, [commentId])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'comment not found'});
        }
        return data.rows[0];
    })
}

function writeArticleComments(req){
    const articleId = req.params.article_id;
    const comment = req.body;
    const queryString = `INSERT INTO comments
                        (body, author, article_id)
                        VALUES ($1, $2, $3) RETURNING *;`;
    return db.query(queryString, [comment.body, comment.username, articleId*1 ])
    .then((data)=>{
        return data.rows;
    })
}

function addArticleVotes(req){
    const articleId = req.params.article_id;
    const voteMod = req.body.inc_votes;
    const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING title, topic, author, votes;`;
    return db.query(queryString, [voteMod*1, articleId*1])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article not found'});
        }
        return data.rows[0];
    })
}

function removeCommentId(req){
    const commentId = req.params.comment_id;
    const queryString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
    return db.query(queryString, [commentId*1])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'comment not found'});
        }
        return data.rows[0]
    })

}

function readUsers(){
    const queryString = `SELECT * FROM users;`;
    return db.query(queryString)
    .then((data)=>{
        return(data.rows)
    })
}

function fetchArticleIds(){
    const fetchArticleIdString = `SELECT articles.article_id FROM articles`;
    return db.query(fetchArticleIdString)
    .then((data)=>{
        const validArticleId = [];
        for(let i=0; i<data.rows.length;i++){
            validArticleId.push(data.rows[i].article_id);
        }
        return validArticleId;
    })
}

module.exports = { readTopics, readEndpoints, readArticle, readArticles, readArticleComments, writeArticleComments, addArticleVotes, removeCommentId, readComment, readUsers };