const playlistsCollection = require('../db/index').db().collection("playlists")
const tracksCollection = require('../db/index').db().collection("tracks")
const ObjectID = require('mongodb').ObjectID

let Playlist = function (data) {
    this.data = {
        user_id: data.user_id,
        track_id: data.track_id
    }
}

Playlist.prototype.addTrack = function() {
    return new Promise(async (resolve, reject) => {
        let playlist = await playlistsCollection.insertOne({user_id: new ObjectID(this.data.user_id), track_id: new ObjectID(this.data.track_id)})
        if(playlist) {
            resolve("Successfully added to your Playlist.")
        } else {
            reject("Something went wrong. Try again later.")
        }
    })
}

Playlist.prototype.checkPlaylist = function() {
    return new Promise(async (resolve, reject) => {
        let track = await playlistsCollection.findOne({user_id: new ObjectID(this.data.user_id), track_id: new ObjectID(this.data.track_id)})
        if(track) {
            resolve(true)
        } else {
            reject(false)
        }
    })
}

Playlist.prototype.deleteTrack = function() {
    return new Promise(async (resolve, reject) => {
        let playlist = await playlistsCollection.findOne({user_id: new ObjectID(this.data.user_id), track_id: new ObjectID(this.data.track_id)})
        if(playlist) {
            await playlistsCollection.deleteOne({user_id: new ObjectID(this.data.user_id), track_id: new ObjectID(this.data.track_id)})
            resolve("Successfully removed from your Playlist.")
        } else {
            reject("Something went wrong.")
        }


    })
}

Playlist.findTrackById = function(id) {
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
                _id: 0,
                title: 1,
                duration: 1,
                link: 1,
                lyrics: 1,
                band_id: 1,
                album_id: 1,
                band_name: {$arrayElemAt: ["$bandDoc.band_name", 0]},
                album: "$albumDoc.album_name"
            }}
        ]).toArray()
        resolve(track)
    })
}

Playlist.display = function(id) {

    // reminder to make it better later
    return new Promise(async (resolve, reject) => {

        let tracks = await tracksCollection.aggregate([
            {$lookup: {from: "bands", localField: "band_id", foreignField: "_id", as: "bandDoc"}},
            {$unwind: {
                path: "$bandDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$lookup: {from: "albums", localField: "album_id", foreignField: "_id", as: "albumDoc"}},
            {$unwind: {
                path: "$bandDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$lookup: {from: "playlists", localField: "_id", foreignField: "track_id", as: "playlistDoc"}},
            {$unwind: {
                path: "$playlistDoc",
                preserveNullAndEmptyArrays: true
            }},
            {$match: {"playlistDoc.user_id": new ObjectID(id)}},
            {$project: {
                band_name: "$bandDoc.band_name",
                band_id: "$bandDoc._id",
                album_id: "$albumDoc._id",
                album_name: {$arrayElemAt: ["$albumDoc.album_name", 0]},
                _id: 1,
                title: 1,
                duration: 1,
            }}
        ]).toArray()

        resolve(tracks)
    })
}

module.exports = Playlist