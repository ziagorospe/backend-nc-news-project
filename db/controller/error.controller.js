exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status && err.msg){
        console.log('custom error')
        res.status(400).send(err.msg);
    }  else {
        next(err);
    }
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02" || err.code === "23502"){
        console.log('psql error')
        res.status(400).send(err)
    } else {
        next(err)
    }
};