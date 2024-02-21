const db = require(`${__dirname}/../connection.js`);
const fs = require('fs/promises');
const endPoints = require(`${__dirname}/../../endpoints.json`)

function readTopics(req){

    const queryString = `SELECT * FROM topics;`;
    return db.query(queryString)
    .then((data)=>{
        return data.rows;
    })
}

function readEndpoints(req){

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
    const queryString = `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING title, topic, author, votes;`;
    return db.query(`SELECT votes FROM articles WHERE article_id = $1;`, [articleId*1])
    .then((data)=>{
        let newVotes;
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'article not found'});
        }
        if(data.rows[0].votes + voteMod < 0){
            newVotes = 0;
        } else {
            newVotes = data.rows[0].votes + voteMod;
        }
        return db.query(queryString, [newVotes, articleId]);
    }).then((data)=>{
        return data.rows[0]
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

module.exports = { readTopics, readEndpoints, readArticle, readArticles, readArticleComments, writeArticleComments, addArticleVotes };