const Band = require('../models/Band.js')

exports.getBands = (req, res) => {
    Band.getBands()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.insertBand = (req, res) => {
    let band = new Band(req.body)
    band.insertBand()
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.getBandById = (req, res) => {
    Band.getBandById(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.updateBand = (req, res) => {
    let band = new Band(req.body)
    band.updateBand(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}

exports.deleteBand = (req, res) => {
    Band.deleteBand(req.params.id)
    .then((response) => {
        res.send(response)
    })
    .catch((err) => {
        res.send(err)
    })
}