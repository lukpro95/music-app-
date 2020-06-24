import React, {Component} from 'react';
import {Title} from '../../components'
import {Link} from 'react-router-dom'

class HomeGuest extends Component {

    render() {
        return (
            <div className="w-100">
            <div className="shadow item py-3">
                <Title title={"Welcome To MusicPedia"} />
                <div className="py-4 px-5 mx-5">
                    <div style={styledText}>Welcome to our interactive Database where you can check constantly updating service of recorded bands, their albums and tracks. </div>
                    <div style={styledText}>
                        Join our community by registering and help us by suggesting bands we've forgotten or missed!
                        You will have an access to store and listen to your favourite tracks on your own, self-created Playlist.
                    </div>
                    <div style={styledText} className="text-muted">
                        <p><em>Incoming Updates: </em></p>
                        <p>- real-time chat</p>
                        <p>- being able to listen to one's created Playlist</p>
                    </div>
                </div>
            </div>
            <div className="d-flex py-4">
                <div className="p-2 item col-2">
                    <Link to="/register"><h5 className="text-center my-auto">Register now!</h5></Link>
                </div>
            </div>
        </div>
        )
    }
}

const styledText = {
    marginBottom: '1rem',
    marginTop: '1rem',
    fontSize: '1.25rem',
    textAlign: 'justify',
}

export default HomeGuest;