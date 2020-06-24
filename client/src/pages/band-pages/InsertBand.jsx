import React, {Component} from 'react';
import api from '../../api'
import {InfoPop, Input, Select, Main, Title} from '../../components'

class InsertBand extends Component {

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
            
            isLoading: false,
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
        console.log(this.state.isLoading)
        this.state.isLoading ? this.setState({isLoading: false}) : this.setState({isLoading: true})
    }

    onSubmit = async (e) => {
        e.preventDefault()

        this.setState({submitting: true, isLoading: true})

        await this.validate()
        .then(async () => {
            api.insertBand(this.state)
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
            })
            .catch((err) => {
                this.setState({errors: [...this.state.errors, "There was a problem with our Database. Try again later."]})
            })
        })
        .catch(() => {
            this.setState({submitting: false})
        })
    }

    render() {
        return (
                <Main>
                    <div className="item py-3 w-100">
                        <Title title={"Add a New Band"} />

                        <div className="mx-5 my-2 w-100 d-flex justify-content-center">
                            <form onSubmit={this.onSubmit} className="w-100" action="">

                                <Input  title={"Band"} mandatory name={"band_name"} type={"text"} 
                                        value={this.state.band_name} onChange={this.onChange} focus />

                                <Input  title={"Genre"} name={"genre"} type={"text"} 
                                        value={this.state.genre} onChange={this.onChange} />

                                <Input  title={"Country / Region"} name={"country_origin"} type={"text"} mandatory
                                        value={this.state.country_origin} onChange={this.onChange} />

                                <Input  title={"Year Formed"} name={"year_formed"} type={"number"} mandatory 
                                        min={1000} max={new Date().getFullYear()+1} value={this.state.year_formed} onChange={this.onChange} />

                                <Input  title={"Record Label"} name={"record_label"} type={"text"} 
                                        value={this.state.record_label} onChange={this.onChange} />

                                <Select title={"Status"} name={"active_status"} type={"text"} array={data}
                                        value={this.state.active_status} onChange={this.onChange} />

                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button className="w-100">Submit</button>
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

export default InsertBand;