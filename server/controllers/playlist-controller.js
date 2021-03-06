const Playlist = require('../models/Playlist.js')

exports.addTrack = (req, res) => {
    let {user_id, track_id} = req.body
    playlist = new Playlist({user_id, track_id})
    playlist.addTrack()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.deleteTrack = (req, res) => {
    let user_id = req.body.user_id
    let track_id = req.params.track_id

    playlist = new Playlist({user_id, track_id})
    playlist.deleteTrack()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.display = (req, res) => {
    Playlist.display(req.body.user_id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.checkPlaylist = (req, res) => {
    let {user_id, track_id} = req.body
    playlist = new Playlist({user_id, track_id})
    playlist.checkPlaylist()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}