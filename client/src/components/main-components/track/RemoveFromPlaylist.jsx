import React, {Component} from 'react';
import api from '../../../api'

class RemoveTrack extends Component {

    removeFromPlaylist = async () => {
        let cookie = document.cookie.substring(9)
        await api.removeFromPlaylist(this.props.id, cookie)
        .then((res) => {
            if(res.data) {
                console.log("Successfully removed from your Playlist!")
                this.props.switchButtons()
            }
        })
    }

    render() {
        return this.props.loggedIn ? <button onClick={this.removeFromPlaylist} className="btn">Remove</button> : <span>Only For Users</span>
    }
}

export default RemoveTrack