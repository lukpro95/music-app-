import React, {Component} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, CreateBand, Main, Title, LoadingComponent, Form} from '../../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

class UpdateAlbum extends Component {

    constructor(props) {
        super(props)

        this.state = {
            album_name: '',
            year_released: '',
            band_id: '',
            band_name: '',
            country_origin: '',
            year_formed: '',

            bands: [{id: 0, name: "Create New Band..", value: 0}],

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
            if(!this.state.band_id.length) {errors.push("Band selection is mandatory for submission.")} 
            else if(this.state.band_id === "0"){
                if(!this.state.band_name.length) {errors.push("Name of a band is mandatory for submission.")}
                if(!this.state.country_origin.length) {errors.push("Country origin is mandatory for submission.")}
                if(!this.state.year_formed.length) {errors.push("Year in which a band was formed is mandatory for submission.")}
            }

            if(!this.state.album_name.length) {errors.push("Name of an album is mandatory for submission.")}
            

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
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            submitting: false
        })

        this.checkIfCreate(e)
    }

    createBand = async () => {
        const {band_name, year_formed, country_origin} = this.state
        await api.insertBand({band_name, year_formed, country_origin})
        .then(() => {
            this.setState({success: [...this.state.success, "Successfully created new Band!"]})
        })
    }

    updateAlbum = async () => {
        const {band_id, album_name, year_released, band_name, year_formed, country_origin} = this.state
        api.updateAlbum(this.props.match.params.id, {band_id, album_name, year_released, band_name, year_formed, country_origin})
        .then((res) => {
            this.returnToAlbum()
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database. Try again later."]})
            this.setState({submitting: false})
        })
    }

    switchPop = () => {
        this.state.isProcessing ? this.setState({isProcessing: false}) : this.setState({isProcessing: true})
    }

    onSubmit = async (e) => {
        e.preventDefault()

        this.setState({submitting: true, isProcessing: true})

        await this.validate()
        .then(async () => {
            const {band_id} = this.state
            
            if(band_id === "0") {
                this.createBand()
            }

            this.updateAlbum()
        })
        .catch(() => {
            this.setState({submitting: false})
        })
    }

    returnToAlbum = () => {
        window.location.href = `/album/${this.props.match.params.id}`
    }

    loadAlbum = async () => {
        await api.getAlbumById(this.props.match.params.id)
        .then(response => {
            const {band_id, album_name, year_released} = response.data[0]
            this.setState({
                band_id: band_id,
                album_name: album_name,
                year_released: year_released
            })
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

    initLoad = () => {
        return new Promise(async(resolve) => {
            await this.loadAlbum()
            await this.loadBands()
            resolve()
        })
    }

    componentDidMount = async () => {
        await this.initLoad()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
        .catch(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }
    
    render() {
        const {isLoading, isProcessing, creatingBand, errors, success, submitting} = this.state
        const {bands, band_name, band_id, country_origin, album_name, year_released, year_formed} = this.state
        return (
                <Main>
                    {isLoading &&
                        <LoadingComponent text={"Loading page..."} />
                    }
                    {!isLoading &&
                        <Content>
                            <Title title={"Update Album"} />
                            <Form onSubmit={this.onSubmit}>
                                <Select 
                                        title={"Band"} mandatory name={"band_id"} type={"text"} array={bands}
                                        value={band_id} onChange={this.onChange} />

                                <CreateBand 
                                        creatingBand={creatingBand} onChange={this.onChange} bandName={band_name} 
                                        countryOrigin={country_origin} yearFormed={year_formed} />
                                
                                <Input  title={"Album"} mandatory name={"album_name"} type={"text"} 
                                            value={album_name} onChange={this.onChange} focus />

                                <Input  title={"Year Released"} name={"year_released"} type={"text"} 
                                            value={year_released} onChange={this.onChange} />

                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button type="submit" className="w-100">Update</button>
                                </div>

                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button type="reset" onClick={this.returnToAlbum} className="w-100 cancel">Cancel</button>
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

export default UpdateAlbum;