import axios from 'axios'

const api = axios.create({
    baseURL: `https://music-store-server-practice.herokuapp.com/api`,
})

// Band related
export const getBands = () => api.get(`/view-bands`)
export const getBandById = (id) => api.get(`/band/${id}`)
export const insertBand = (data) => api.post('/band', data)
export const updateBand = (id, data) => api.put(`/band/${id}`, data)
export const deleteBand = (id) => api.delete(`/band/${id}`)

// Album related
export const getAlbumById = (id) => api.get(`/album/${id}`)
export const getAlbumsByBand = (band_id) => api.get(`/${band_id}/albums`)
export const insertAlbum = (data) => api.post('/album', data)
export const updateAlbum = (id, data) => api.put(`/album/${id}`, data)
export const deleteAlbum = (id) => api.delete(`/album/${id}`)

// Track related
export const getTracks = () => api.get(`/view-tracks`)
export const getTrackById = (id) => api.get(`/track/${id}`)
export const getTracksByAlbumId = (id) => api.get(`/album/${id}/tracks`)
export const insertTrack = (data) => api.post('/track', data)
export const updateTrack = (id, data) => api.put(`/track/${id}`, data)
export const deleteTrack = (id) => api.delete(`/track/${id}`)

// User related
export const register = (data) => api.post('/register', data)
export const logIn = (data) => api.post('/login', data)
export const logOut = (data) => api.post('/logout', data)
export const checkIfLoggedIn = (data) => api.post('/loggedIn', data)
export const doesUserExist = (data) => api.post(`/doesUsernameExist`, data)
export const doesEmailExist = (data) => api.post(`/doesEmailExist`, data)

// Playlist related
export const addToPlaylist = (id, cookie) => api.post(`playlist/track`, {track_id: id, token: cookie})
export const displayPlaylist = (cookie) => api.get(`/playlist/display/${cookie}`)
export const removeFromPlaylist = (id, cookie) => api.delete(`/playlist/${id}`, {data: {token: cookie}})
export const isOnPlaylist = (id, cookie) => api.post('/isOnPlaylist/', {track_id: id, token: cookie})

const apis = {
    register,
    logIn,
    logOut,
    checkIfLoggedIn,
    doesUserExist,
    doesEmailExist,
    addToPlaylist,
    removeFromPlaylist,
    displayPlaylist,
    isOnPlaylist,
    getBands,
    getAlbumsByBand,
    getAlbumById,
    deleteAlbum,
    getTracksByAlbumId,
    getTracks,
    deleteBand,
    updateBand,
    updateAlbum,
    insertBand,
    insertAlbum,
    insertTrack,
    getTrackById,
    deleteTrack,
    updateTrack,
    getBandById
}

export default apis