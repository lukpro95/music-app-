const Playlist = require('../models/Playlist.js')

exports.addTrack = (req, res) => {
    let {user_id, track_id} = req.body
    playlist = new Playlist({user_id, track_id})
    promiseHandler(playlist.addTrack(), req, res)
}

exports.deleteTrack = (req, res) => {
    let user_id = req.body.user_id
    let track_id = req.params.track_id
    playlist = new Playlist({user_id, track_id})
    promiseHandler(playlist.deleteTrack(), req, res)
}

exports.display = (req, res) => {
    promiseHandler(Playlist.display(req.body.user_id), req, res)
}

exports.checkPlaylist = (req, res) => {
    let {user_id, track_id} = req.body
    playlist = new Playlist({user_id, track_id})
    promiseHandler(playlist.checkPlaylist(), req, res)
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