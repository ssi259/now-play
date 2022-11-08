const jwt = require('jsonwebtoken')

exports.auth = async (req, resp, next) => {
    const jwt_token = req.headers['x-access-token'];
    if (!jwt_token) {
        return resp.status(401).send({ status:"failure",message:'token not found' })
    }
    try {
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY)
        req.user = decoded
    } catch(e) {
        return resp.status(401).send({status:"failure",message:'invalid token'})
    }
    next()
}
