import React, {Component} from 'react';

class AddBand extends Component {

    onChange = async (e) => {
        this.props.onChange(e)
    }

    render() {
        return (
            this.props.creatingBand ?
            <div>
                <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto">                            
                    <h4>Band Name <span className="mandatory">*</span></h4>
                    <input 
                        onChange={this.onChange} className="info more" name="band_name" 
                        value={this.props.bandName || ""} type="text" autoComplete="off" 
                    /> 
                </div>
                <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto"> 
                    <h4>Year Formed <span className="mandatory">*</span></h4>
                    <input 
                        onChange={this.onChange} className="info more" name="year_formed" 
                        value={this.props.yearFormed || ""} type="text" autoComplete="off" 
                    /> 
                </div>
                <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto"> 
                    <h4>Country Origin <span className="mandatory">*</span></h4>
                    <input 
                        onChange={this.onChange} className="info more" name="country_origin" 
                        value={this.props.countryOrigin || ""} type="text" autoComplete="off" 
                    />
                </div>
            </div>
            : <span></span>
        )
    }
}

export default AddBand;