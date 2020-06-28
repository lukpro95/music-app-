import React, {Component} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, Main, Title, LoadingComponent, Form} from '../../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'shadow item py-3'
})``

class UpdateBand extends Component {

    constructor(props) {
        super(props)

        this.state = {
            band_name: '',
            genre: '',
            country_origin: '',
            year_formed: '',
            record_label: '',
            active_status: 1,
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
            if(!this.state.band_name.length) {errors.push("Name of a band is mandatory for submission.")}
            if(!this.state.country_origin.length) {errors.push("Country origin of a band is mandatory for submission.")}
            if(!this.state.year_formed.length) {errors.push("Year in which band was formed is mandatory for submission.")}

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

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            submitting: false
        })
    }

    switchPop = () => {
        this.state.isProcessing ? this.setState({isProcessing: false}) : this.setState({isProcessing: true})
    }

    onSubmit = async () => {
        this.setState({submitting: true, isProcessing: true})

        await this.validate()
        .then(() => {
            this.updateBand()
        })
        .catch(() => {
            this.setState({submitting: false})
        })
    }

    updateBand = async () => {
        const {band_name, genre, country_origin, year_formed, record_label, active_status} = this.state
        api.updateBand(this.props.match.params.id, {band_name, genre, country_origin, year_formed, record_label, active_status})
        .then(() => {
            this.setState({success: [...this.state.success, "Successfully added new Band!"]})

            this.setState({
                band_name: '',
                genre: '',
                country_origin: '',
                year_formed: '',
                record_label: '',
                active_status: '',
            })
            this.returnToBand()
        })
        .catch((err) => {
            this.setState({errors: [...this.state.errors, "There was a problem with our Database. Try again later."]})
        })
    }

    returnToBand = () => {
        window.location.href = `/band/${this.props.match.params.id}`
    }

    loadBand = () => {
        return new Promise(async(resolve, reject) => {
            await api.getBandById(this.props.match.params.id)
            .then(response => {
                const {band_name, genre, country_origin, year_formed, record_label, active_status} = response.data
                this.setState({
                    band_name: band_name,
                    genre: genre,
                    country_origin: country_origin,
                    year_formed: year_formed,
                    record_label: record_label,
                    active_status: active_status
                })
                resolve()
            })
            .catch(() => {
                reject()
            })
        })
    }

    componentDidMount = async () => {
        await this.loadBand()
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
        const {isLoading, isProcessing, errors, success, submitting} = this.state
        const {band_name, genre, country_origin, record_label, active_status, year_formed} = this.state
        return (
                <Main>
                    {isLoading &&
                        <LoadingComponent text="Loading page..."/>
                    }
                    {!isLoading && 
                            <Content>
                                <Title title={"Update Band"} />
                                    <Form onSubmit={this.onSubmit}>
                                        <Input  title={"Band"} mandatory name={"band_name"} type={"text"} 
                                                value={band_name} onChange={this.onChange} focus />

                                        <Input  title={"Genre"} name={"genre"} type={"text"} 
                                                value={genre} onChange={this.onChange} />

                                        <Input  title={"Country / Region"} name={"country_origin"} type={"text"} mandatory
                                                value={country_origin} onChange={this.onChange} />

                                        <Input  title={"Year Formed"} name={"year_formed"} type={"number"} mandatory 
                                                min={1000} max={new Date().getFullYear()+1} value={year_formed} onChange={this.onChange} />

                                        <Input  title={"Record Label"} name={"record_label"} type={"text"} 
                                                value={record_label} onChange={this.onChange} />

                                        <Select title={"Status"} name={"active_status"} type={"text"} array={data}
                                                value={active_status} onChange={this.onChange} />

                                        <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                            <button type="submit" className="w-100">Update</button>
                                        </div>
                                        <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                            <button type="reset" onClick={this.returnToBand} className="w-100 cancel">Cancel</button>
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

const data = [
    {
        id: 0,
        name: 'Active',
        value: 1
    },
    {
        id: 1,
        name: 'Not Active',
        value: 0
    }
]

export default UpdateBand;