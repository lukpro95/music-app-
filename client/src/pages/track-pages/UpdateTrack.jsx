import React, {Component} from 'react';
import api from '../../api'
import {CreateBand, CreateAlbum, InfoPop, Select, Input, TextArea, Main, Title, Form, LoadingComponent} from '../../components'
import { createRef } from 'react';
import styled from 'styled-components'

const Wrapper = styled.div.attrs({
    className: 'w-100'
})``

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

class UpdateTrack extends Component {

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

    updateTrack = async () => {
        const {title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin} = this.state
        await api.updateTrack(this.props.match.params.id, {title, duration, link, lyrics, band_id, album_id, album_name, band_name, year_formed, country_origin})
        .then(() => {
            this.setState({success: [...this.state.success, "Successfully added new track! Thank you!"]})
            this.returnToTrack()
            
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database connection. Try again later."]})
        })
    }

    switchPop = () => {
        this.state.isProcessing ? this.setState({isProcessing: false}) : this.setState({isProcessing: true})
    }

    submitHandler = async (e) => {
        this.setState({submitting: true, isProcessing: true})

        await this.validate()
        .then(async () => {
            const {band_id, album_id} = this.state
            
            if(band_id === "0") {
                this.createBand()
            }
            if(album_id === "0") {
                this.createAlbum()
            }
            this.updateTrack()
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

            isProcessing: false,
            submitting: false
        })
        
        this.bandRef.current.value = "DEFAULT"
        this.albumRef.current.value = "DEFAULT"
    }

    returnToTrack = () => {
        window.location.href = `/track/${this.props.match.params.id}`
    }

    loadTrack = async () => {
        await api.getTrackById(this.props.match.params.id)
        .then(response => {
            const {band_id, album_id, title, duration, link, lyrics} = response.data[0]
            this.setState({
                band_id: band_id,
                album_id: album_id,
                title: title,
                duration: duration,
                link: link,
                lyrics: lyrics
            })
        })
        .catch(err => {
            console.log(err)
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
        return new Promise(async(resolve) => {
            await this.loadTrack()
            await this.loadBands()
            await this.loadAlbums(this.state.band_id)
            resolve()
        })
    }

    componentDidMount = async () => {
        await this.loadData()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }
    
    render() {
        const {isLoading} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text={"Loading page..."} />
                }
                {!isLoading &&
                    <Wrapper>
                        <Content>
                            <Title title={"Update Track"} />
                            <Form onSubmit={this.submitHandler}>
                                <Select 
                                        title={"Band"} mandatory name={"band_id"} type={"text"} array={this.state.bands}
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
                                        onChange={this.onChange}/>

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
                                    <button type="submit" className="w-100">Update</button>
                                </div>
                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button type="reset" onClick={this.returnToTrack} className="w-100 cancel">Cancel</button>
                                </div>
                            </Form>
                        </Content>
                        {this.state.isProcessing ? 
                            <InfoPop 
                                errors={this.state.errors} success={this.state.success} 
                                submitting={this.state.submitting} switch={this.switchPop}
                            /> 
                            : 
                            <span></span>
                        }
                    </Wrapper>
                }
            </Main>
        )
    }

}

export default UpdateTrack;