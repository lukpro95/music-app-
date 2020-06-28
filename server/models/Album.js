const albumsCollection = require('../db/index').db().collection("albums")
const bandsCollection = require('../db/index').db().collection("bands")
const tracksCollection = require('../db/index').db().collection("tracks")
const ObjectID = require('mongodb').ObjectID

let Album = function (data) {
    this.data = data;
}

Album.getAlbums = function() {
    return new Promise(async (resolve, reject) => {
        try {
            albumsCollection.find({}).sort({year_released: 1}).toArray(function (err, result) {
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

Album.getAlbumById = function(id) {
    return new Promise(async (resolve, reject) => {
        let album = await albumsCollection.aggregate([
            {$match: {
                _id: new ObjectID(id)
            }},
            {$lookup: {from: "bands", localField: "band_id", foreignField: "_id", as: "bandDoc"}},
            {$project: {
                _id: 0,
                id: "$_id",
                album_name: 1,
                year_released: 1,
                band_name: {$arrayElemAt: ["$bandDoc.band_name", 0]},
                band_id: {$arrayElemAt: ["$bandDoc._id", 0]}
            }}
        ]).toArray()
        resolve(album)
    })
}

Album.getAlbumsByBandId = function(band_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let albums = await bandsCollection.aggregate([
                {$match: {
                    _id: new ObjectID(band_id)
                }},
                {$lookup: {from: "albums", localField: "_id", foreignField: "band_id", as: "albumsDoc"}},
                {$project: {
                    _id: 0, 
                    albums: "$albumsDoc"
                }}
            ]).toArray()
            resolve(albums)
        } catch {
            resolve({})
        }
    })
}

Album.prototype.getBandId = function() {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({band_name: this.data.band_name, country_origin: this.data.country_origin, year_formed: this.data.year_formed})
        if(band) {
            resolve(band._id)
        } else {
            reject("Not Found.")
        }
    })
}

Album.prototype.doesExist = function() {
    return new Promise(async (resolve, reject) => {
        let album = await albumsCollection.findOne({
            band_id: new ObjectID(this.data.band_id),
            album_name: this.data.album_name
        })
        if(album) {
            reject()
        } else {
            resolve()
        }
    })
}

Album.prototype.insertAlbum = function() {
    return new Promise(async (resolve, reject) => {
        if(this.data.band_id === "0") {
            await this.getBandId()
            .then(id => (this.data.band_id = id))
            .catch(err => reject(err));
        }

        await this.doesExist()
        .then(async () => {
            await this.actuallyInsertAlbum()
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
        .catch(() => {
            reject("This album already exists in the database.")
        })
    })
}

Album.prototype.actuallyInsertAlbum = function () {
    return new Promise(async(resolve, reject) => {
        let album = await albumsCollection.insertOne({band_id: new ObjectID(this.data.band_id), album_name: this.data.album_name, year_released: this.data.year_released})
        if(album) {
            resolve("Successfully added a new Album!")
        } else {
            reject("Encountered an error. Try again later.")
        }
    })
}

Album.deleteAlbum = function(id) {
    return new Promise(async (resolve, reject) => {
        let album = await albumsCollection.findOne({_id: new ObjectID(id)})
        if(album) {
            await tracksCollection.deleteMany({album_id: new ObjectID(id)})
            await albumsCollection.deleteOne({_id: new ObjectID(id)})
            resolve("Successfully deleted album.")
        } else {
            reject("Couldn't find such album in our database.")
        }
    })
}

Album.prototype.updateAlbum = function(id) {
    return new Promise(async (resolve, reject) => {
        
        //When band was just created
        if(this.data.band_id === "0") {
            await this.getBandId()
            .then(id => (this.data.band_id = id))
            .catch(err => reject(err));
        }

        await this.actuallyUpdateAlbum(id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

Album.prototype.actuallyUpdateAlbum = function(id) {
    return new Promise(async(resolve, reject) => {
        let album = await albumsCollection.findOne({_id: new ObjectID(id)})
        if(album) {
            await albumsCollection.updateOne({_id: new ObjectID(id)}, 
            {$set: {
                band_id: new ObjectID(this.data.band_id), 
                album_name: this.data.album_name, 
                year_released: this.data.year_released
            }})
            await tracksCollection.updateMany({album_id: new ObjectID(id)}, {$set: {band_id: new ObjectID(this.data.band_id)}})
            resolve("Successfully updated Album!")
        } else {
            reject("Couldn't find such Album.")
        }
    })
}

module.exports = Album