const tracksCollection = require('../db/index').db().collection("tracks")
const albumsCollection = require('../db/index').db().collection("albums")
const bandsCollection = require('../db/index').db().collection("bands")
const ObjectID = require('mongodb').ObjectID

let Track = function (data) {
    this.data = {
        band_id: data.band_id || 0,
        band_name: data.band_name,
        country_origin: data.country_origin,
        year_formed: data.year_formed,

        album_id: data.album_id || 0,
        album_name: data.album_name,

        title: data.title, 
        duration: data.duration || "",
        link: data.link || "",
        lyrics: data.lyrics || ""
    }
}

Track.getTrackById = function(id) {
    return new Promise(async (resolve, reject) => {
        let track = await tracksCollection.aggregate([
            {$match: {
                _id: new ObjectID(id)
            }},
            {$lookup: {from: "albums", localField: "album_id", foreignField: "_id", as: "albumDoc"}},
            {$unwind: {
                path: "$albumDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$lookup: {from: "bands", localField: "band_id", foreignField: "_id", as: "bandDoc"}},
            {$project: {
                _id: 1,
                title: 1,
                duration: 1,
                link: 1,
                lyrics: 1,
                band_id: 1,
                album_id: 1,
                band_name: {$arrayElemAt: ["$bandDoc.band_name", 0]},
                album_name: "$albumDoc.album_name"
            }}
        ]).toArray()
        resolve(track)
    })
}

Track.getTracks = function() {
    return new Promise(async (resolve, reject) => {
        let tracks = await tracksCollection.aggregate([
            {$lookup: {from: "albums", localField: "album_id", foreignField: "_id", as: "albumDoc"}},
            {$unwind: {
                path: "$albumDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$lookup: {from: "bands", localField: "band_id", foreignField: "_id", as: "bandDoc"}},
            {$project: {
                _id: 1,
                title: 1,
                duration: 1,
                band_id: 1,
                album_id: 1,
                year_released: "$albumDoc.year_released",
                band_name: {$arrayElemAt: ["$bandDoc.band_name", 0]},
                album_name: "$albumDoc.album_name"
            }},
            {$sort: {band_name: 1, year_released: 1}}
        ]).toArray()
        resolve(tracks)
    })
}

Track.getTracksByAlbumId = function(id) {
    return new Promise(async (resolve, reject) => {
        let tracks = await albumsCollection.aggregate([
            {$match: {
                _id: new ObjectID(id)
            }},
            {$lookup: {from: "bands", localField: "band_id", foreignField: "_id", as: "bandDoc"}},
            {$unwind: {
                path: "$bandDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$lookup: {from: "tracks", localField: "_id", foreignField: "album_id", as: "tracksDoc"}},
            {$project: {
                _id: 1,
                album_name: 1,
                year_released: 1,
                band_name: "$bandDoc.band_name",
                band_id: "$bandDoc._id",
                tracks: "$tracksDoc"
            }}
        ]).toArray()
        resolve(tracks)
    })
}

Track.prototype.updateTrack = function(id) {
    return new Promise(async (resolve, reject) => {
        
        //When band was just created
        if(this.data.band_id === "0") {
            this.data.band_id = await this.getBandId()
            .then(id => (this.data.band_id = id))
            .catch(err => reject(err));
        }
        
        //When album was just created
        if(this.data.album_id === "0") {
            this.data.album_id = await this.getAlbumIdByNameAndId()
            .then(id => (this.data.album_id = id))
            .catch(err => reject(err));
        }

        await this.actuallyUpdateTrack(id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

Track.prototype.actuallyUpdateTrack = function (id) {
    return new Promise(async(resolve, reject) => {
        let track = await tracksCollection.findOne({_id: ObjectID(id)})
        if(track) {
            await tracksCollection.updateOne({_id: ObjectID(id)}, 
            {$set: {
                band_id: ObjectID(this.data.band_id),
                album_id: ObjectID(this.data.album_id),
                title: this.data.title, 
                duration: this.data.duration, 
                link: this.data.link,
                lyrics: this.data.lyrics,
            }})
            resolve("Successfully updated this Track!")
        } else {
            reject("Couldn't find such Track.")
        }
    })
}

Track.prototype.insertTrack = function() {
    return new Promise(async (resolve, reject) => {

        if(this.data.band_id === "0") {
            await this.getBandId()
            .then(id => (this.data.band_id = id))
            .catch(err => reject(err));
        }
        
        if(this.data.album_id === "0") {
            await this.getAlbumIdByNameAndBandId()
            .then(id => (this.data.album_id = id))
            .catch(err => reject(err))
        }

        await this.actuallyInsertTrack()
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

Track.prototype.actuallyInsertTrack = function () {
    return new Promise(async(resolve, reject) => {
        let track = await tracksCollection.insertOne({
            band_id: new ObjectID(this.data.band_id), 
            album_id: new ObjectID(this.data.album_id), 
            title: this.data.title, 
            duration: this.data.duration,
            link: this.data.link,
            lyrics: this.data.lyrics
        })
        if(track) {
            resolve("Successfully added a new Track!")
        } else {
            reject("Encountered an error. Try again later.")
        }
    })
}

Track.deleteTrack = function(id) {
    return new Promise(async (resolve, reject) => {
        let track = await tracksCollection.findOne({_id: ObjectID(id)})
        if(track) {
            await tracksCollection.deleteOne({_id: ObjectID(id)})
            resolve("Successfully deleted track.")
        } else {
            reject("Couldn't find such track in our database.")
        }
    })
}

Track.prototype.getBandId = function() {
    return new Promise(async (resolve, reject) => {
        let band = await bandsCollection.findOne({band_name: this.data.band_name, country_origin: this.data.country_origin, year_formed: this.data.year_formed})
        if(band) {
            resolve(band._id)
        } else {
            reject("Not Found.")
        }
    })
}

Track.prototype.getAlbumIdByNameAndBandId = function() {
    return new Promise(async (resolve, reject) => {
        let album = await albumsCollection.findOne({album_name: this.data.album_name, band_id: new ObjectID(this.data.band_id)})
        if(album) {
            resolve(album._id)
        } else {
            reject("Not Found.")
        }
    })
}

module.exports = Track