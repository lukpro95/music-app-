import React, {Component, createRef} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, CreateBand, Main, Title} from '../../components'

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

            bands: [],

            errors: [],
            success: [],

            isLoading: false,
            submitting: false,
        }
        
        this.bandRef = createRef()
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
            this.reset()
            window.location.href = `/album/${this.props.match.params.id}`
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database. Try again later."]})
            this.setState({submitting: false})
        })
    }

    reset = () => {
        this.setState({
            band_name: '',
            genre: '',
            country_origin: '',
            year_formed: '',
            record_label: '',
            active_status: '',

            bands: [],

            submitting: false
        })
    }

    switchPop = () => {
        this.state.isLoading ? this.setState({isLoading: false}) : this.setState({isLoading: true})
    }

    onSubmit = async (e) => {
        e.preventDefault()

        this.setState({submitting: true, isLoading: true})

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

    componentDidMount = async () => {
        await api.getAlbumById(this.props.match.params.id)
        .then(response => {
            const {band_id, album_name, year_released} = response.data[0]
            this.setState({
                band_id: band_id,
                album_name: album_name,
                year_released: year_released
            })
        })

        await api.getBands()
        .then(response => {
            this.setState({bands: response.data})
        })
    }
    
    render() {

        const array1 = [{id: 0, name: "Create New Band..", value: 0}]

        this.state.bands.map(band => {
            return array1.push({id: band._id, name: `${band.band_name} | ${band.country_origin} | ${band.year_formed}`, value: band._id})
        })
        
        return (
                <Main>
                    <div className="w-100">
                        <div className="item py-3">
                            <Title title={"Update Album"} />
                            <div className="d-flex justify-content-between py-4 px-5 mx-5">

                                <form onSubmit={this.onSubmit} className="w-100" action="">

                                    <Select 
                                            parentRef={this.bandRef} title={"Band"} mandatory name={"band_id"} type={"text"} array={array1}
                                            value={this.state.band_id} onChange={this.onChange} />

                                    <CreateBand 
                                            creatingBand={this.state.creatingBand} onChange={this.onChange} bandName={this.state.band_name} 
                                            countryOrigin={this.state.country_origin} yearFormed={this.state.year_formed} />
                                    
                                    <Input  title={"Album"} mandatory name={"album_name"} type={"text"} 
                                                value={this.state.album_name} onChange={this.onChange} focus />

                                    <Input  title={"Year Released"} name={"year_released"} type={"text"} 
                                                value={this.state.year_released} onChange={this.onChange} />

                                    <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                        <button type="submit" className="w-100">Update</button>
                                    </div>

                                    <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                        <button type="reset" onClick={this.returnToAlbum} className="w-100 cancel">Cancel</button>
                                    </div>

                                </form>

                            </div>
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

export default UpdateAlbum;