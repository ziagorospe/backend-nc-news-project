const db = require(`${__dirname}/../connection.js`);
const fs = require('fs/promises');
const endPoints = require(`${__dirname}/../../endpoints.json`)

function readTopics(req){

    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((data)=>{
        return data.rows
    })
}

function readEndpoints(req){

    return fs.readFile(`${__dirname}/../../endpoints.json`)
    .then((data)=>{
        const parsedData = JSON.parse(data)
        return parsedData;
    })
}

function readArticle(req){
    //req.params => {article_id: 'int'}
    const articleId = req.params.article_id
    const queryString = `SELECT * FROM articles WHERE articles.article_id = $1;`
    return db.query(queryString, [articleId])
    .then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({status: 400, msg: 'bad request'})
        }
        return data.rows[0]
    })
}

module.exports = { readTopics, readEndpoints, readArticle };