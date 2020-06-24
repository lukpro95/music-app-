const Band = require('../models/Band.js')

exports.getBands = (req, res) => {
    promiseHandler(Band.getBands(), req, res)
}

exports.insertBand = (req, res) => {
    let band = new Band(req.body)
    promiseHandler(band.insertBand(), req, res)
}

exports.getBandById = (req, res) => {
    promiseHandler(Band.getBandById(req.params.id), req, res)
}

exports.updateBand = (req, res) => {
    let band = new Band(req.body)
    promiseHandler(band.updateBand(req.params.id), req, res)
}

exports.deleteBand = (req, res) => {
    promiseHandler(Band.deleteBand(req.params.id), req, res)
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