const db = require(`${__dirname}/../connection.js`);
const fs = require('fs/promises');

function readTopics(req){

    const queryString = `SELECT * FROM topics;`
    return db.query(queryString)
    .then((data)=>{
        return data.rows
    })
}

function readEndpoints(req){

    return fs.readFile(`${__dirname}/../../endpoints.json`)
    .then((data) => {
        const parsedData = JSON.parse(data)
        return parsedData;
    })
}

module.exports = { readTopics, readEndpoints };