const bandsCollection = require('../db/index').db().collection("bands")
const albumsCollection = require('../db/index').db().collection("albums")
const tracksCollection = require('../db/index').db().collection("tracks")
const ObjectID = require('mongodb').ObjectID

let Band = function (data) {
    this.data = {
        band_name: data.band_name,
        genre: data.genre || "",
        country_origin: data.country_origin,
        year_formed: data.year_formed,
        active_status: data.active_status || 1,
        record_label: data.record_label || "",
    }
}

Band.prototype.validate = function() {
    return new Promise(async(resolve, reject) => {
        if(!this.data.active_status) {this.data.active_status = 1}
        await this.doesExist()
        .then(() => {
            resolve()
        })
        .catch(() => {
            reject()
        })
    })

}

Band.prototype.doesExist = function() {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({
            band_name: this.data.band_name,
            country_origin: this.data.country_origin,
            year_formed: this.data.year_formed
            })
        if(band) {
            reject()
        } else {
            resolve()
        }
    })
}

Band.getBands = function() {
    return new Promise(async (resolve, reject) => {
        try {
            bandsCollection.find({}).sort({ band_name: 1 }).toArray(function (err, result) {
                if (err) {
                    this.errors.push("An unknown error has occurred. Try again later.")
                    reject(this.errors)
                }
                resolve(result)
            })
        } catch {
            reject("There was an error with our database. Try again later.")
        }
    })
}

Band.getBandById = function(id) {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({_id: new ObjectID(id)})
        if(band) {
            resolve(band)
        } else {
            reject("There's no such Band.")
        }
    })
}

Band.prototype.insertBand = function() {
    return new Promise(async (resolve, reject) => {
        await this.validate()
        .then(async () => {
            let band = await bandsCollection.insertOne(this.data)
            if(band) {
                resolve("Successfully inserted a new Band.")
            } else {
                reject("Encountered an error. Try again later.")
            }
        })
        .catch(() => {
            reject("This band already exists in the database.")
        })

    })
}

Band.deleteBand = function(id) {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({_id: new ObjectID(id)})
        if(band) {
            await tracksCollection.deleteMany({band_id: new ObjectID(id)})
            await albumsCollection.deleteMany({band_id: new ObjectID(id)})
            await bandsCollection.deleteOne({_id: new ObjectID(id)})
            resolve("Successfully deleted band.")
        } else {
            reject("Couldn't find such band in our database.")
        }
    })
}

Band.prototype.updateBand = function(id) {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({_id: new ObjectID(id)})
        if(band) {
            await bandsCollection.updateOne({_id: new ObjectID(id)}, 
            {$set: {
                band_name: this.data.band_name, 
                genre: this.data.genre, 
                country_origin: this.data.country_origin, 
                year_formed: this.data.year_formed,
                record_label: this.data.record_label, 
                active_status: this.data.active_status
            }})
            resolve("Successfully updated Band!")
        } else {
            reject("Couldn't find such Band.")
        }
    })
}

module.exports = Band