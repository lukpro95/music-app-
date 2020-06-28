import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title, LoadingComponent} from '../../components'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

const TableWrapper = styled.div.attrs({
    className: 'd-flex justify-content-between py-4 px-5 mx-5'
})``

const SubContent = styled.div.attrs({
    className: 'd-flex py-4'
})``

const TwoColumns = styled.div.attrs({
    className: 'p-5 item col-6'
})``

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
            tracks: [],
            isLoading: true
        }
    }

    getTracks = async () => {
        return new Promise(async (resolve, reject) => {
            await api.getTracksByAlbumId(this.props.match.params.id)
            .then((response) => {
                this.setState({
                    band_id: response.data[0].band_id,
                    album: response.data[0],
                    tracks: response.data[0].tracks
                })
                resolve()
            })
            .catch(() => reject())
        })
    }

    componentDidMount = async () => {
        await this.getTracks()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
        .catch(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }

    render() {
        const {isLoading} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text={"Loading page..."}/>
                }
                {!isLoading &&
                <>
                    <Content>
                        <Title title={"Album Details"} />
                        <TableWrapper>
                            <Table columns={albumColumns} data={[this.state.album]} />
                        </TableWrapper>
                    </Content>
                    <SubContent>
                        <TwoColumns className="mr-4">
                            <h3 className="title mb-4 text-center">Albums</h3>
                            <Table columns={trackColumns} data={this.state.tracks} />
                        </TwoColumns>
                        <TwoColumns>
                            <h3 className="title mb-4">Album Cover</h3>
                            <p className="text-muted"><em>Will be available in future updates</em></p>
                        </TwoColumns>
                    </SubContent>
                </>
                }
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