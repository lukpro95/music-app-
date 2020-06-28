const Track = require('../models/Track.js')

exports.getTracks = (req, res) => {
    Track.getTracks()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getLastAddedTracks = (req, res) => {
    Track.getLastAddedTracks()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.insertTrack = (req, res) => {
    let track = new Track(req.body)
    track.insertTrack()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getTrackById = (req, res) => {
    Track.getTrackById(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getTracksByAlbumId = (req, res) => {
    Track.getTracksByAlbumId(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.updateTrack = (req, res) => {
    let track = new Track(req.body)
    track.updateTrack(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.deleteTrack = (req, res) => {
    Track.deleteTrack(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}