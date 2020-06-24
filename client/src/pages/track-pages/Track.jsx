import React, {Component} from 'react';
import api from '../../api'
import {Video, Lyrics, Table, Main, Title} from '../../components'
import {Link} from 'react-router-dom'

class Add extends Component {

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

class Remove extends Component {

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

class Update extends Component {
    render() {
        return <Link to={`/track/${this.props.id}/update`}><i className="fa fa-edit"></i></Link>
    }
}

class Track extends Component {

    constructor(props) {
        super(props)

        this.state = {
            _id: '',
            band_name: '',
            title: '',
            album: '',
            duration: '',
            link: '',
            lyrics: '',
            loggedIn: false,
            added: false
        }
    }

    switchButtons = () => {
        this.state.added ? this.setState({added: false}) : this.setState({added: true})
    }

    componentDidMount = async () => {
        await api.getTrackById(this.props.match.params.id)
        .then((response) => {
            const {_id, band_id, album_id, band_name, title, album_name, duration, link, lyrics} = response.data[0]
            this.setState({
                _id: _id,
                album_id: album_id,
                band_id: band_id,
                band_name: band_name,
                title: title,
                album_name: album_name,
                duration: duration,
                link: link,
                lyrics: lyrics,
                loggedIn: this.props.loggedIn
            })
        })
        .catch(() => {
            this.setState({
                
            })
        })

        let cookie = document.cookie.substring(9)
        await api.isOnPlaylist(this.props.match.params.id, cookie)
        .then((response) => {
            if(response.data) {
                this.setState({
                    added: true
                })
            } else {
                this.setState({
                    added: false
                })
            }
        })
    }

    columns = () => {
        return ([
            {
                Header: "Band Name",
                accessor: "band_name",
                Cell: function(props) {
                    return (
                        <Link to={`/band/${props.row.original.band_id}`}>
                            {props.row.original.band_name}
                        </Link>
                    )
                }
            },
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Album",
                accessor: "album_name",
                Cell: function(props) {
                    return (
                        <Link to={`/album/${props.row.original.album_id}`}>
                            {props.row.original.album_name}
                        </Link>
                    )
                }
            },
            {
                Header: "Duration",
                accessor: "duration",
            },    
            {
                Header: "Playlist",
                accessor: "add",
                Cell: () => {
                    return (
                        <div>
                            {this.state.added ? 
                            <Remove loggedIn={this.props.loggedIn} id={this.state._id} switchButtons={this.switchButtons} /> : 
                            <Add loggedIn={this.props.loggedIn} id={this.state._id} switchButtons={this.switchButtons} />}
                        </div>
                    )
                }
            },
            {
                Header: "",
                accessor: "change",
                Cell: function(props) {
                    return (
                        <div>
                            <Update id={props.cell.row.original._id} />
                            <Delete id={props.cell.row.original._id} />
                        </div>
                    )
                }
            },
        ])
    } 

    render() {
        return (
            <Main>
                <div className="w-100">
                    <div className="item py-3">
                        <Title title={"Track Details"} />
                        <div className="d-flex justify-content-between py-4 px-5 mx-5">
                            <Table columns={this.columns()} data={[this.state]}/>
                        </div>
                    </div>
                    <div className="d-flex py-4">
                        <Video link={this.state.link} title={this.state.title}/>
                        <Lyrics text={this.state.lyrics} />
                    </div>
                </div>
            </Main>
        )
    }
}

export default Track