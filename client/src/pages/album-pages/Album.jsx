import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title} from '../../components'
import {Link} from 'react-router-dom'

class Delete extends Component {

    deleteAlbum = () => {
        if(window.confirm("Are you sure to delete this album from the database? It will delete all tracks inside. Once done it cannot be undone.")) {
            console.log(this.props.id)
            api.deleteAlbum(this.props.id)
            .then(() => {
                console.log("Successfully deleted this album.")
            })
            .catch((err) => {
                console.log("Error")
            })
            window.location.href=`/View-Bands/`
        }
    }
    
    render() {
        return <span onClick={this.deleteAlbum}><i className="fa fa-trash mx-5"></i></span>
    }
}

class Update extends Component {
    render() {
        return <Link to={`/album/${this.props.id}/update`}><i className="fa fa-edit"></i></Link>
    }
}

class Album extends Component {

    constructor(props) {
        super(props)
        this.state = {
            band_id: '',
            album: [],
            tracks: []
        }
    }

    componentDidMount = async () => {
        await api.getTracksByAlbumId(this.props.match.params.id)
        .then((response) => {
            this.setState({
                band_id: response.data[0].band_id,
                album: response.data[0],
                tracks: response.data[0].tracks
            })
        })
    }

    render() {
        return (
            <Main>
                <div className="w-100">
                    <div className="item py-3">
                        <Title title={"Album Details"} />
                        <div className="d-flex justify-content-between py-4 px-5 mx-5">
                            <Table columns={albumColumns} data={[this.state.album]} />
                        </div>
                    </div>
                    <div className="d-flex py-4">
                        <div className="p-5 item mr-4 col-6">
                            <h3 className="title mb-4 text-center">Albums</h3>
                            <Table columns={trackColumns} data={this.state.tracks} />
                        </div>
                        <div className="p-5 item col-6">
                            <h3 className="title mb-4">Album Cover</h3>
                            <p className="text-muted"><em>Will be available in future updates</em></p>
                        </div>
                    </div>
                </div>
            </Main>
        )
    }
}

const trackColumns = [
    {
        Header: "Title",
        accessor: "title",
        Cell: function(props) {
            return <Link to={`/track/${props.row.original._id}`}>{props.row.original.title}</Link>
        }
    },
    {
        Header: "Duration",
        accessor: "duration",
    },
]

const albumColumns = [
    {
        Header: "Band Name",
        accessor: "band_name",
        Cell: function(props) {
            console.log(props.row.original)
            return <Link to={`/band/${props.row.original.band_id}`}>{props.row.original.band_name}</Link>
        }
    },
    {
        Header: "Album Name",
        accessor: "album_name",
    },
    {
        Header: "Year Released",
        accessor: "year_released",
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
]

export default Album