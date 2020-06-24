const express = require('express')
const app = express()
const routerAPI = require('./router-api')

app.use(express.urlencoded({extended: false})) // accepting html form submit
app.use(express.json()) // accepting json data

app.use('/api/', routerAPI)

module.exports = app