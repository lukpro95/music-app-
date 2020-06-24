const Track = require('../models/Track.js')

exports.getTracks = (req, res) => {
    promiseHandler(Track.getTracks(), req, res)
}

exports.insertTrack = (req, res) => {
    let track = new Track(req.body)
    promiseHandler(track.insertTrack(), req, res)
}

exports.getTrackById = (req, res) => {
    promiseHandler(Track.getTrackById(req.params.id), req, res)
}

exports.getTracksByAlbumId = (req, res) => {
    promiseHandler(Track.getTracksByAlbumId(req.params.id), req, res)
}

exports.updateTrack = (req, res) => {
    let track = new Track(req.body)
    promiseHandler(track.updateTrack(req.params.id), req, res)
}

exports.deleteTrack = (req, res) => {
    promiseHandler(Track.deleteTrack(req.params.id), req, res)
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