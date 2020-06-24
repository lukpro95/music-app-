const usersCollection = require('../db/index').db().collection("users")
const bcrypt = require('bcryptjs')
const validator = require('validator')
const md5 = require('md5')

let User = function (data) {
    this.data = data;
    this.errors = []
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.user_name)   != "string"){this.data.user_name = ""}
    if(typeof(this.data.user_email)      != "string"){this.data.user_email = ""}
    if(typeof(this.data.user_password)   != "string"){this.data.user_password = ""}

    // get rid of any bogus properties
    this.data = {
        user_name: this.data.user_name.trim().toLowerCase(),
        user_email: this.data.user_email.trim().toLowerCase(),
        user_password: this.data.user_password
    }
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => { // async to enable await keyword
        if(this.data.user_name == ''){this.errors.push("You must provide a username.")}
        if(this.data.user_name.length > 0 && this.data.user_name.length < 4){this.errors.push("Username must be at least 4 characters long.")}
        if(this.data.user_name.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
        if(this.data.user_name.length != '' && !validator.isAlphanumeric(this.data.user_name)) {this.errors.push("Username can only contain letters and numbers!")}
    
        // download email validator -> npm install validator
        if(!validator.isEmail(this.data.user_email)){this.errors.push("You must provide a valid email address.")}
    
        if(this.data.user_password == ''){this.errors.push("You must provide a password.")}
        if(this.data.user_password.length > 0 && this.data.user_password.length < 8){this.errors.push("Password must be at least 8 characters long.")}
        if(this.data.user_password.length > 40) {this.errors.push("Password cannot exceed 40 characters.")}
    
        // Only if username is valid then check if it's already taken
        if(this.data.user_name.length > 3 && this.data.user_name.length < 31 && validator.isAlphanumeric(this.data.user_name)){
            let usernameExists = await usersCollection.findOne({user_name: this.data.user_name})
            if(usernameExists){this.errors.push("That username is already taken.")}
        }
    
        // Only if email is valid then check if it's already taken
        if(validator.isEmail(this.data.user_email)){
            let emailExists = await usersCollection.findOne({user_email: this.data.user_email})
            if(emailExists){this.errors.push("That email is already being used.")}
        }

        resolve()
    })
}

User.prototype.logIn = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({user_name: this.data.user_name}).then((attemptedClient) => {
            if(attemptedClient && bcrypt.compareSync(this.data.user_password, attemptedClient.user_password)){
                this.data = attemptedClient
                resolve({user_name: this.data.user_name, user_id: this.data._id})
            } else {
                reject("Invalid username / password")
            }
        }).catch(() => {
            reject("Please try again later.")
        })
    })
}

User.prototype.registerUser = function(){
    return new Promise(async (resolve, reject) => {
        // Step #1: Validate user data
        this.cleanUp()
        await this.validate()
    
        // Step #2: Only if! there are no validation errors then save the user data into a database
        if (!this.errors.length) {
            // hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.user_password = bcrypt.hashSync(this.data.user_password, salt)
            await usersCollection.insertOne(this.data)
            
            resolve("Successfully registered.")
        } else {
            reject(this.errors)
        }
    })
}

User.doesUsernameExist = function(username) {
    return new Promise(async (resolve, reject) => {
        if(typeof(username) != "string") {
            resolve(false)
            return
        }

        let user = await usersCollection.findOne({user_name: username})
        if(user) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

User.doesEmailExist = function(email) {
    return new Promise(async (resolve, reject) => {
        if(typeof(email) != "string") {
            resolve(false)
            return
        }

        let user = await usersCollection.findOne({user_email: email})
        if(user) {
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

module.exports = User