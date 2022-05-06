const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user')
const authConfig = require('../config/auth.json')
const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (request, response) => {
    const { email} = request.body
    if (await User.findOne({ email })) {
        return response.status(400).send({ msg: 'This email has already been registered'})
    }

    try {
        const user = await User.create(request.body)

        user.password = undefined

        return response.send({
            user,
            token: generateToken({ id: user.id })
        })


    } catch (err) {
        console.log(`> Error register: ${err}`)
        return response.status(500).send({msg: 'Error at the server'})
    }
})

router.post('authenticate', async (request, response) => {
    const {email, password} = request.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {response.status(400).send({msg: 'User not found'})}

    if (! await bcrypt.compare(password, user.password)) {response.status(400).send({msg: 'Password incorrect'})}

    user.password = undefined


    response.send({
        user,
        token: generateToken({ id: user.id })
    })
})

module.exports = app => app.use('/auth', router)