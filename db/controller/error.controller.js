exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send(err.msg);
    }  else {
        next(err);
    }
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02" || err.code === "23502"){
        res.status(400).send(err)
    } else {
        next(err)
    }
};