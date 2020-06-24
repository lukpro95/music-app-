import React, {Component} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, CreateAlbum, CreateBand, TextArea, Main, Title} from '../../components'
import {createRef} from 'react'

class InsertTrack extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: '',
            duration: '',
            link: '',
            lyrics: '',

            bands: [],
            creatingBand: false,
            band_name: '',
            band_id: '',
            year_formed: '',
            country_origin: '',

            albums: [],
            creatingAlbum: false,
            album_name: '',
            album_id: '',
            year_released: '',

            errors: [],
            success: [],

            isLoading: false,
            submitting: false,
        }

        this.bandRef = createRef()
        this.albumRef = createRef()

    }

    validate = () => {
        return new Promise ( async(resolve, reject) => {
            let errors = []
            if(!this.state.band_id.length) {errors.push("Band selection is mandatory for submission.")} else
            if(this.state.band_id === "0"){
                if(!this.state.band_name.length) {errors.push("Name of a band is mandatory for submission.")}
                if(!this.state.country_origin.length) {errors.push("Country origin is mandatory for submission.")}
                if(!this.state.year_formed.length) {errors.push("Year in which a band was formed is mandatory for submission.")}
            }
    
            if(!this.state.title.length) {errors.push("Title is mandatory for submission.")}
    
            if(!this.state.album_id.length) {errors.push("Album selection is mandatory for submission.")} else 
            if(this.state.album_id === "0"){
                if(!this.state.album_name.length) {errors.push("Name of an album is mandatory for submission.")}
            }

            let success = []
            if(!errors.length) {
                this.setState({success: success, errors: errors}, () => {
                    resolve()
                })
            } else {
                this.setState({success: success, errors: errors}, () => {
                    reject()
                })
            }
        })
    }

    checkIfCreate = (e) => {
        if(e.target.name === 'band_id') {
            if(e.target.value < 1) { this.setState({creatingBand: true}) } else {this.setState({creatingBand: false})}
        }

        if(e.target.name === 'album_id') {
            if(e.target.value < 1) { this.setState({creatingAlbum: true}) } else {this.setState({creatingAlbum: false})}
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            submitting: false
        })
        this.checkIfCreate(e)

        if(e.target.name === "band_id"){
            this.setState({albums: []})
            this.loadAlbums(e.target.value)
        }
    }

    switchPop = () => {
        console.log(this.state.isLoading)
        this.state.isLoading ? this.setState({isLoading: false}) : this.setState({isLoading: true})
    }

    createBand = async () => {
        const {band_name, year_formed, country_origin} = this.state
        await api.insertBand({band_name, year_formed, country_origin})
        .then(() => 
            this.setState({success: [...this.state.success, "Successfully created new band."]})
        )
    }

    createAlbum = async () => {
        const {album_name, band_id, year_released, band_name, year_formed, country_origin} = this.state
        await api.insertAlbum({album_name, band_id, year_released, band_name, year_formed, country_origin})
        .then(() => 
            this.setState({success: [...this.state.success, "Successfully created new album."]})
        )
    }

    createTrack = async () => {
        const {title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin} = this.state
        await api.insertTrack({title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin})
        .then(() => {
            this.setState({success: [...this.state.success, "Successfully added new track! Thank you!"]})
            this.reset()
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database connection. Try again later."]})
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()

        this.setState({submitting: true, isLoading: true})

        await this.validate()
        .then(async () => {
            const {band_id, album_id} = this.state
            
            if(band_id === "0") {
                this.createBand()
            }
            if(album_id === "0") {
                this.createAlbum()
            }
            this.createTrack()
        })
        .catch(() => {
            this.setState({submitting: false})
        })
    }

    reset = () => {
        this.setState({
            title: '',
            duration: '',
            link: '',
            lyrics: '',
            band_id: '',
            album_id: '',

            creatingBand: false,
            band_name: '',
            year_formed: '',
            country_origin: '',

            creatingAlbum: false,
            album_name: '',
            year_released: '',

            isLoading: false,
            submitting: false
        })
        
        this.bandRef.current.value = "DEFAULT"
        this.albumRef.current.value = "DEFAULT"
    }

    componentDidMount = async () => {
        await api.getBands()
        .then(response => {
            this.setState({bands: response.data})
        })
        .catch(err => {
            console.log(err)
        })
    }

    loadAlbums = async (id) => {
        await api.getAlbumsByBand(id)
        .then(response => {
            this.setState({albums: response.data[0].albums})
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    render() {
        const array1 = [{id: 0, name: "Create New Band..", value: 0}]
        const array2 = [{id: 0, name: "Create New Album..", value: 0}]

        this.state.bands.map(band => {
            return array1.push({id: band._id, name: `${band.band_name} | ${band.country_origin} | ${band.year_formed}`, value: band._id})
        })

        this.state.albums.map(album => {
            return array2.push({id: album._id, name: album.album_name, value: album._id})
        })

        return (
                <Main>
                    <div className="item py-3 w-100">
                        <Title title={"Add a New Track"} />
                        <div className="mx-5 my-2 w-100 d-flex justify-content-center">
                            <form onSubmit={this.onSubmit} className="w-100" action="">

                                <Select 
                                        parentRef={this.bandRef} title={"Band"} mandatory name={"band_id"} type={"text"} array={array1}
                                        value={this.state.band_id} onChange={this.onChange} />

                                <CreateBand 
                                        creatingBand={this.state.creatingBand} onChange={this.onChange} bandName={this.state.band_name} 
                                        countryOrigin={this.state.country_origin} yearFormed={this.state.year_formed} />

                                <Select 
                                        parentRef={this.albumRef} title={"Album"} mandatory name={"album_id"} type={"text"} array={array2}
                                        value={this.state.album_id} onChange={this.onChange} />

                                <CreateAlbum    
                                        creatingAlbum={this.state.creatingAlbum} onChange={this.onChange} 
                                        albumName={this.state.album_name} yearReleased={this.state.year_released} />

                                <Input 
                                        mandatory title={"Title"} name={"title"} type={"text"} value={this.state.title || ""}
                                        onChange={this.onChange} focus/>

                                <Input 
                                        title={"Duration"} name={"duration"} type={"time"} value={this.state.duration || ""}
                                        onChange={this.onChange}/>
                                
                                <Input 
                                        title={"Link"} name={"link"} type={"text"} value={this.state.link || ""}
                                        onChange={this.onChange}/>

                                <TextArea 
                                        title={"Lyrics"} name={"lyrics"} value={this.state.lyrics || ""}
                                        onChange={this.onChange}/>

                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button type="submit" className="w-100">Submit</button>
                                </div>

                            </form>
                        </div>
                    </div>

                    {this.state.isLoading   ? <InfoPop 
                                                errors={this.state.errors} success={this.state.success} 
                                                submitting={this.state.submitting} switch={this.switchPop}/> 
                                            : 
                                            <span></span>}
                </Main>
        )
    }

}

export default InsertTrack;