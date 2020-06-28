import React, {Component} from 'react';
import api from '../../../api'

class AddTrack extends Component {

    addToPlaylist = async () => {
        let cookie = document.cookie.substring(9)
        await api.addToPlaylist(this.props.id, cookie)
        .then((res) => {
            if(res.data) {
                console.log("Successfully added to your Playlist!")
                this.props.switchButtons()
            }
        })
    }

    render() {
        return this.props.loggedIn ? <button onClick={this.addToPlaylist} className="btn">Add</button> : <span>Only For Users</span>
    }
}

export default AddTrack