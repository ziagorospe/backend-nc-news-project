const { readTopics } = require(`${__dirname}/../model/model.js`)

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

module.exports = { getTopics }