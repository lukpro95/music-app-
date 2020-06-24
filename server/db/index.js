const mongodb = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()

mongodb.connect(process.env.CONNSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){ 
    module.exports = client
    console.log("Connected")
    const app = require('../app')
    app.listen(process.env.PORT)
})