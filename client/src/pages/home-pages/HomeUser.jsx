import React, {Component} from 'react';
import {Title, Table} from '../../components'
import {Link} from 'react-router-dom'
import api from '../../api';

class Delete extends Component {

    removeTrack = async () => {
        await api.removeFromPlaylist(this.props.track_id, document.cookie.substring(9))
        .then((res) => {
            if(res) {
                this.props.remove(this.props.track_id)
            }
        })
    }

    render() {
        return (
            <div onClick={this.removeTrack}><i className="fa fa-trash mx-5"></i></div>
        )
    }
}

class HomeUser extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tracks: []
        }
    }

    componentDidMount = async () => {
        await api.displayPlaylist(document.cookie.substring(9))
        .then((res) => {
            if(res.data) {
                res.data.map(track => {
                    return this.setState({tracks: [...this.state.tracks, {
                        ...track,
                        id: res.data.indexOf(track)+1,
                    }]})
                })

            }
        })
    }

    removeTrack = (id) => {
        this.setState({tracks: this.state.tracks.filter(function(track) { 
            return track._id !== id
        })});
    }

    render() {
        return (
            <div className="w-100">
            <div className="shadow item py-3">
                <Title title={"Your Playlist"} />
                <div className="py-4 px-5 mx-5">
                    {
                        this.state.tracks.length > 0 ? 
                        <Table columns={columns} data={this.state.tracks} remove={this.removeTrack}/> :
                        <h4 className="text-muted">
                            It seems that you have no tracks in your Playlist. 
                            If you find your favourite track in our Database, simply click on the Add button in a track details. 
                            After that you will be able to see it here.</h4>
                    }
                </div>
            </div>
            {/* <div className="d-flex py-4">
                <div className="p-2 item col-2">
                    <Link to="/register"><h5 className="text-center my-auto">Play</h5></Link>
                </div>
            </div> */}
        </div>
        )
    }
}

const columns = [
    {
        Header: "No.#",
        accessor: "id",
        Cell: function(props) {
            return (
                <span>{parseInt(props.row.id)+1}</span>
            )
        }
    },
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
        Cell: function(props) {
            return (
                <Link to={`/track/${props.row.original._id}`}>
                    {props.row.original.title}
                </Link>
            )
        }
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
    // {
    //     Header: "Reposition",
    //     accessor: "reposition",
    //     Cell: function() {
    //         return (
    //             <div className="d-flex justify-content-center">
    //                 <span className="d-flex"><i className="fa fa-arrow-up mx-2"></i></span>
    //                 <span className="d-flex"><i className="fa fa-arrow-down mx-2"></i></span>
    //             </div>
    //         )
    //     }
    // },
    {
        Header: "Remove",
        accessor: "remove",
        Cell: function(props) {
            return (
                <Delete track_id={props.row.original._id} remove={props.remove}/>
            )
        }
    },
]

export default HomeUser;