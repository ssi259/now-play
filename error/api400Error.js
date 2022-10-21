const httpStatusCodes = require('../error/httStatusCodes')
const BaseError = require('../error/baseError')

class Api400Error extends BaseError {
    constructor(
    name,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = 'BAD REQUEST',
    isOperational = true,
 
 
 ) {
 super(name, statusCode, isOperational, description)
 }
}

module.exports = Api400Error