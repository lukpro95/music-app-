import React, { Component } from 'react'
import api from '../../../api'

class Delete extends Component {

    deleteTrack = () => {
        if(window.confirm("Are you sure to delete this track from the database? Once done it cannot be undone.")) {
            api.deleteTrack(this.props.id)
            .then(() => {
                console.log("Successfully deleted this track.")
            })
            .catch((err) => {
                console.log("Error")
            })
            window.location.href=`/View-Tracks/`
        }
    }
    
    render() {
        return <span onClick={this.deleteTrack}><i className="fa fa-trash mx-5"></i></span>
    }

}

export default Delete