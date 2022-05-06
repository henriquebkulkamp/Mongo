const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (request, response, next) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {return response.status(401).send({ msg: 'No token provided' })}

    const parts = authHeader.split(' ')

    if (!parts.length === 2) {return response.status(401).send({ msg: 'Token invalid' })}

    const [ scheme, token ] = parts

    if (!/^Bearer$/i, test(scheme)) {
        return response.status(401).send({ msg: 'Token invalid' })
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {response.status(401).send( {msg: 'Token invalid' })}

        request.userId = decoded.id
        return next()
    })

}