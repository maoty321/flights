const { StatusCodes } = require("http-status-codes")
const CustomApiError = require("./customApi")


class NotFound extends CustomApiError { 
    constructor(message) { 
        super(message),
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = NotFound