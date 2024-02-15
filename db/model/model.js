const db = require(`${__dirname}/../connection.js`);

function readTopics(req){
    if(Object.keys(req.query).length > 0){
        return Promise.reject({status: 400, msg: 'bad request'})
    }
    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((data)=>{
        return data.rows
    })
}

module.exports = { readTopics };