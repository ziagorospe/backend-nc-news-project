exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send(err);
    }  else {
        next(err);
    }
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02" || err.code === "23502"){
        err.msg = 'bad request'
        res.status(400).send(err)
    } else if (err.code === "23503"){
        err.msg = 'not found'
        res.status(404).send(err)
    } else {
        next(err)
    }
};