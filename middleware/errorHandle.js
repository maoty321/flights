const customApiError = require('../error/customApi')
const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof customApiError) { 
        return res.status(err.statusCode).json({ msg: err.message })
    }   
    console.log(err)
    return res.status(500).json({err: err, msg: 'Something went wrong, please try again' })
   
}

module.exports = errorHandlerMiddleware