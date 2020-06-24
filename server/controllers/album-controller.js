const Album = require('../models/Album.js')

exports.getAlbums = (req, res) => {
    promiseHandler(Album.getAlbums(), req, res)
}

exports.getAlbumById = (req, res) => {
    promiseHandler(Album.getAlbumById(req.params.id), req, res)
}

exports.getAlbumsByBandId = (req, res) => {
    promiseHandler(Album.getAlbumsByBandId(req.params.band_id), req, res)
}

exports.insertAlbum = (req, res) => {
    let album = new Album(req.body)
    promiseHandler(album.insertAlbum(), req, res)
}

exports.updateAlbum = (req, res) => {
    let album = new Album(req.body)
    promiseHandler(album.updateAlbum(req.params.id), req, res)
}

exports.deleteAlbum = (req, res) => {
    promiseHandler(Album.deleteAlbum(req.params.id), req, res)
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