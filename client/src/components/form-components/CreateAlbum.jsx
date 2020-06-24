import React, {Component} from 'react';

class AddAlbum extends Component {

    onChange = (e) => {
        this.props.onChange(e)
    }

    render() {
        return (
            this.props.creatingAlbum ?
            <div>
                <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto">                            
                    <h4>Album Name <span className="mandatory">*</span></h4>
                    <input 
                        onChange={this.onChange} className="info more" name="album_name" 
                        value={this.props.albumName || ""} type="text" autoComplete="off" 
                    /> 
                </div>
                <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto"> 
                    <h4>Year Released</h4>
                    <input 
                        onChange={this.onChange} className="info more" name="year_released" 
                        value={this.props.yearReleased || ""} type="text" autoComplete="off" 
                    /> 
                </div>
            </div>
            :
            <span></span>
        )
    }
}

export default AddAlbum;