const User = require('../models/User.js')
const jwt = require('jsonwebtoken')

exports.registerUser = (req, res) => {
    let user = new User(req.body)
    promiseHandler(user.registerUser(), req, res)
}

exports.logIn = (req, res) => {
    let user = new User(req.body)
    user.logIn()
    .then((response) => {
        let token = jwt.sign({user_name: response.user_name, user_id: response.user_id}, process.env.JWTSECRET, {expiresIn: '7d'})
        res.json({message: "Logged In", token: token})
    })
    .catch(() => {
        res.json("Invalid username / password")
    })
}

exports.loggedIn = (req, res) => {
    try {
        req.user = jwt.verify(req.body.user, process.env.JWTSECRET)
        res.json(true)
    } catch {
        res.json(false)
    }
}

exports.isLoggedIn = (req, res, next) => {
    try {
        let user = jwt.verify(req.body.token || req.params.crypted, process.env.JWTSECRET)
        if(user) {
            req.body.user_id = user.user_id
            req.body.user_name = user.user_name
            next()
        } else {
            res.json("Invalid Token.")
        }
    } catch {
        res.json(false)
    }
}

exports.logOut = (req, res) => {
    try {
        jwt.sign({user_id: 12}, process.env.JWTSECRET, {expiresIn: '1s'})
        res.json("Logged out.")
    } catch {
        res.json(false)
    }
}

exports.doesUsernameExist = (req, res) => {
    promiseHandler(User.doesUsernameExist(req.body.user_name), req, res)
}

exports.doesEmailExist = (req, res) => {
    promiseHandler(User.doesEmailExist(req.body.user_email), req, res)
}

promiseHandler = function(func, req, res) {
    return (
        func
        .then((response) => {
            res.send(response)
        })
        .catch((err) => {
            res.send(err)
        })
    )
}