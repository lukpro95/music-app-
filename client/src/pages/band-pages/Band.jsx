import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title, LoadingComponent} from '../../components'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item shadow py-3 w-100'
})``

const SubContent = styled.div.attrs({
    className: 'd-flex py-4'
})``

const TwoColumns = styled.div.attrs({
    className: 'p-5 item col-6'
})``

const TableWrapper = styled.div.attrs({
    className: 'd-flex justify-content-between py-4 px-5 mx-5'
})``

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
            albums: [],
            isLoading: true,
        }
    }

    loadBand = async () => {
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
    }

    loadAlbums = async () => {
        await api.getAlbumsByBand(this.props.match.params.id)
        .then(response => {
            this.setState({albums: response.data[0].albums})
        })
        .catch(err => {
            console.log("Something went wrong.")
        })
    }

    initLoad = () => {
        return new Promise(async (resolve) => {
            await this.loadBand()
            await this.loadAlbums()
            resolve()
        })
    }

    componentDidMount = async () => {
        await this.initLoad()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }

    render() {
        const {isLoading, albums} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text="Loading page..."/>
                }
                {!isLoading &&
                    <>
                        <Content>
                            <Title title={"Band Details"} />
                            <TableWrapper>
                                <Table columns={bandColumns} data={[this.state]} />
                            </TableWrapper>
                        </Content>
                        <SubContent>
                            <TwoColumns className="mr-4">
                                <h3 className="title mb-4 text-center">Albums</h3>
                                <Table columns={albumColumns} data={albums} />
                            </TwoColumns>
                            <TwoColumns>
                                <h3 className="title mb-4">Current Members</h3>
                                <p className="text-muted"><em>Will be available in future updates</em></p>
                            </TwoColumns>
                        </SubContent>
                    </>
                }
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