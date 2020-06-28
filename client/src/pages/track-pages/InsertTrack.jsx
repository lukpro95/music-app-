import React, {Component} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, CreateAlbum, CreateBand, TextArea, Main, Title, Form, LoadingComponent} from '../../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

class InsertTrack extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: '',
            duration: '',
            link: '',
            lyrics: '',

            bands: [{id: 0, name: "Create New Band..", value: 0}],
            creatingBand: false,
            band_name: '',
            band_id: '',
            year_formed: '',
            country_origin: '',

            albums: [{id: 0, name: "Create New Album..", value: 0}],
            creatingAlbum: false,
            album_name: '',
            album_id: '',
            year_released: '',

            errors: [],
            success: [],
            
            isLoading: true,
            isProcessing: false,
            submitting: false,
        }

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
            this.setState({albums: [{id: 0, name: "Create New Album..", value: 0}]})
            this.loadAlbums(e.target.value)
        }
    }

    switchPop = () => {
        this.state.isProcessing ? this.setState({isProcessing: false}) : this.setState({isProcessing: true})
    }

    createBand = async () => {
        const {band_name, year_formed, country_origin} = this.state
        await api.insertBand({band_name, year_formed, country_origin})
        .then((res) => {
            if(res.data.includes("This band already exists in the database.")) {
                this.setState({errors: [...this.state.errors, "This band already exists in the database."]})
            } else {
                this.setState({success: [...this.state.success, "Successfully created new band."]})
            }
        })
    }

    createAlbum = async () => {
        const {album_name, band_id, year_released, band_name, year_formed, country_origin} = this.state
        await api.insertAlbum({album_name, band_id, year_released, band_name, year_formed, country_origin})
        .then((res) => {
            if(res.data.includes("This album already exists in the database.")) {
                this.setState({errors: [...this.state.errors, "This album already exists in the database."]})
            } else {
                this.setState({success: [...this.state.success, "Successfully created new album."]})
            }
        })
    }

    createTrack = async () => {
        const {title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin} = this.state
        await api.insertTrack({title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin})
        .then((res) => {
            if(!res.data.includes("This track already exists in the database.")){
                this.setState({success: [...this.state.success, "Successfully added new track! Thank you."]})
                this.reset()
            } else {
                this.setState({errors: [...this.state.errors, "This track already exists in the database."]})
            }
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database connection. Try again later."]})
        })
    }

    onSubmit = async (e) => {
        this.setState({submitting: true, isProcessing: true})

        await this.validate()
        .then(async () => {
            const {band_id, album_id} = this.state
            
            if(band_id === "0") {
                await this.createBand()
            }
            if(album_id === "0") {
                await this.createAlbum()
            }

            if(this.state.errors.length === 0) {
                await this.createTrack()
            }
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
            submitting: false
        })
    }

    loadBands = async () => {
        await api.getBands()
        .then(response => {
            this.setState({
                bands: this.state.bands.concat(
                    response.data.map(band => {
                        return {
                            id: band._id, 
                            name: `${band.band_name} | ${band.country_origin} | ${band.year_formed}`, 
                            value: band._id
                        }
                    })
                )
            })
        })
    }

    loadAlbums = async (id) => {
        await api.getAlbumsByBand(id)
        .then(response => {
            this.setState({
                albums: this.state.albums.concat(
                    response.data[0].albums.map(album => {
                        return {id: album._id, name: album.album_name, value: album._id}
                    })
                )
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    loadData = () => {
        return new Promise (async (resolve) => {
            await this.loadBands()
            resolve()
        })
    }

    componentDidMount = () => {
        this.loadData()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }

    render() {
        const {isLoading, isProcessing, errors, success, submitting} = this.state
        return (
                <Main>
                    {isLoading &&
                        <LoadingComponent text={"Loading page..."} />
                    }
                    {!isLoading &&
                        <Content>
                            <Title title={"Add a New Track"} />
                            <Form onSubmit={this.onSubmit}>

                                <Select 
                                        parentRef={this.bandRef} title={"Band"} mandatory name={"band_id"} type={"text"} array={this.state.bands}
                                        value={this.state.band_id} onChange={this.onChange} />

                                <CreateBand 
                                        creatingBand={this.state.creatingBand} onChange={this.onChange} bandName={this.state.band_name} 
                                        countryOrigin={this.state.country_origin} yearFormed={this.state.year_formed} />

                                <Select 
                                        parentRef={this.albumRef} title={"Album"} mandatory name={"album_id"} type={"text"} array={this.state.albums}
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

                            </Form>
                        </Content>
                    }
                    {isProcessing ? 
                        <InfoPop 
                            errors={errors} success={success} 
                            submitting={submitting} switch={this.switchPop}
                        /> 
                        : 
                        <></>
                    }
                </Main>
        )
    }

}

export default InsertTrack;