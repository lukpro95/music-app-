const express = require('express')
const router = express.Router()

const trackController = require('./controllers/track-controller.js')
const bandController = require('./controllers/band-controller.js')
const albumController = require('./controllers/album-controller.js')
const userController = require('./controllers/user-controller.js')
const playlistController = require('./controllers/playlist-controller.js')
const cors = require('cors')

router.use(cors())

//User related
router.post('/login', userController.logIn)
router.post('/loggedIn', userController.loggedIn)
router.post('/logout', userController.logOut)

// registration related
router.post('/register', userController.registerUser)
router.post('/doesUsernameExist', userController.doesUsernameExist)
router.post('/doesEmailExist', userController.doesEmailExist)

//Bands related
router.get('/view-bands', bandController.getBands)
router.get('/band/:id', bandController.getBandById)
router.post('/band', bandController.insertBand)
router.put('/band/:id', bandController.updateBand)
router.delete('/band/:id', bandController.deleteBand)

//Album related
router.get('/:band_id/albums', albumController.getAlbumsByBandId)
router.get('/album/:id', albumController.getAlbumById)
router.post('/album', albumController.insertAlbum)
router.put('/album/:id', albumController.updateAlbum)
router.delete('/album/:id', albumController.deleteAlbum)

// Tracks related
router.get('/view-tracks', trackController.getTracks)
router.get('/track/:id', trackController.getTrackById)
router.get('/album/:id/tracks', trackController.getTracksByAlbumId)
router.post('/track', trackController.insertTrack)
router.put('/track/:id', trackController.updateTrack)
router.delete('/track/:id', trackController.deleteTrack)

//Playlist related
router.get('/playlist/display/:crypted', userController.isLoggedIn, playlistController.display)
router.post('/playlist/track', userController.isLoggedIn, playlistController.addTrack)
router.post('/isOnPlaylist', userController.isLoggedIn, playlistController.checkPlaylist)
router.delete('/playlist/:track_id', userController.isLoggedIn, playlistController.deleteTrack)

module.exports = router