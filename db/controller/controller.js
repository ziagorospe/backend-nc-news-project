const { readTopics, readEndpoints } = require(`${__dirname}/../model/model.js`)

function getTopics(req, res, next){
    readTopics(req)
    .then((topics) => {
        const topicsResponse = {
            topics: topics
        }
        res.status(200).send(topicsResponse);
    })
    .catch(next)
}

function getEndpoints(req, res, next){
    readEndpoints(req)
    .then((endPoints) => {
        res.status(200).send(endPoints);
    })
    .catch(next)  
}

module.exports = { getTopics, getEndpoints }