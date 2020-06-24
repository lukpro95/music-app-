import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title} from '../../components'
import {Link} from 'react-router-dom'

class Delete extends Component {

    deleteBand = () => {
        if(window.confirm("Are you sure to delete this band from the database? It will delete all albums and tracks inside. Once done it cannot be undone.")) {
            api.deleteBand(this.props.id)
            .then(() => {
                console.log("Successfully deleted this band.")
            })
            .catch((err) => {
                console.log("Error")
            })
            window.location.href=`/View-Bands/`
        }
    }
    
    render() {
        return <span onClick={this.deleteBand}><i className="fa fa-trash mx-5"></i></span>
    }
}

class Update extends Component {
    render() {
        return <Link to={`/band/${this.props.id}/update`}><i className="fa fa-edit"></i></Link>
    }
}

class Band extends Component {

    constructor(props) {
        super(props)

        this.state = {
            _id: '',
            band_name: '',
            genre: '',
            country_origin: '',
            year_formed: '',
            record_label: '',
            active_status: '',
            albums: []
        }
    }

    componentDidMount = async () => {
        await api.getBandById(this.props.match.params.id)
        .then((response) => {
            const {band_name, genre, country_origin, year_formed, record_label, active_status} = response.data
            this.setState({
                _id: this.props.match.params.id,
                band_name: band_name,
                genre: genre,
                country_origin: country_origin,
                year_formed: year_formed,
                record_label: record_label,
                active_status: active_status
            })
        })

        await api.getAlbumsByBand(this.props.match.params.id)
        .then(response => {
            this.setState({albums: response.data[0].albums})
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <Main>
                <div className="w-100">
                    <div className="item py-3">
                        <Title title={"Band Details"} />
                        <div className="d-flex justify-content-between py-4 px-5 mx-5">
                            <Table columns={bandColumns} data={[this.state]} />
                        </div>
                    </div>
                    <div className="d-flex py-4">
                        <div className="p-5 item mr-4 col-6">
                            <h3 className="title mb-4 text-center">Albums</h3>
                            <Table columns={albumColumns} data={this.state.albums} />
                        </div>
                        <div className="p-5 item col-6">
                            <h3 className="title mb-4">Current Members</h3>
                            <p className="text-muted"><em>Will be available in future updates</em></p>
                        </div>
                    </div>
                </div>
            </Main>
        )
    }
}

const albumColumns = [
    {
        Header: "Album Name",
        accessor: "album_name",
        Cell: function(props) {
            return <Link to={`/album/${props.row.original._id}`}>{props.row.original.album_name}</Link>
        }
    },
    {
        Header: "Year Released",
        accessor: "year_released",
    },
]

const bandColumns = [
    {
        Header: "Band Name",
        accessor: "band_name",
    },
    {
        Header: "Genre",
        accessor: "genre",
    },
    {
        Header: "Country Origin",
        accessor: "country_origin",
    },
    {
        Header: "Year Formed",
        accessor: "year_formed",
    },
    {
        Header: "Record Label",
        accessor: "record_label",
    },
    {
        Header: "Active Status",
        accessor: "active_status",
        Cell: function(props) {
            return props.row.original.active_status === 1 ? <div className="active">Active</div> : <div className="not-active">Not Active</div>
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
]

export default Band