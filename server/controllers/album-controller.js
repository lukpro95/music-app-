const Album = require('../models/Album.js')

exports.getAlbums = (req, res) => {
    Album.getAlbums()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getAlbumById = (req, res) => {
    Album.getAlbumById(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getAlbumsByBandId = (req, res) => {
    Album.getAlbumsByBandId(req.params.band_id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.insertAlbum = (req, res) => {
    let album = new Album(req.body)
    album.insertAlbum()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.updateAlbum = (req, res) => {
    let album = new Album(req.body)
    album.updateAlbum(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.deleteAlbum = (req, res) => {
    Album.deleteAlbum(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}