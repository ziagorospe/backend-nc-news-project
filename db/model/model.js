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
    //req.params => {article_id: 'int'}
    const articleId = req.params.article_id*1;
    if(typeof articleId !== 'number'){
        return Promise.reject({status: 400, msg: 'bad request'});
    }
    const queryString = `SELECT * FROM articles WHERE articles.article_id = $1;`
    return db.query(queryString, [articleId])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 404, msg: 'bad request'});
        }
        return data.rows[0];
    })
}

function readArticles(){
    const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::int AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    return db.query(queryString)
    .then((data)=>{
        return data.rows;
    })
}

module.exports = { readTopics, readEndpoints, readArticle, readArticles };