import React, {Component} from 'react';
import api from '../../api'
import {Video, Lyrics, Table, Main, Title, AddToPlaylist, RemoveFromPlaylist, DeleteTrack, LoadingComponent} from '../../components'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const MainInfo = styled.div.attrs({
    className: 'item py-3',
})``

const AdditionalInfo = styled.div.attrs({
    className: 'd-flex py-4'
})``

const TableWrapper = styled.div.attrs({
    className: 'd-flex justify-content-between py-4 px-5 mx-5'
})``

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
            added: false,
            isLoading: true
        }

    }

    switchButtons = () => {
        this.state.added ? this.setState({added: false}) : this.setState({added: true})
    }

    loadData = () => {
        return new Promise(async (resolve) => {
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
                    lyrics: lyrics
                })
                resolve()
            })
        })
    }

    componentDidMount = async () => {
        await this.loadData()
        .then(() => {
            setTimeout(() => {
                this.setState({isLoading: false})
            }, 150)
        })
    }

    columns = [
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
            Cell: () => {
                return (
                    <div>
                        {this.state.added ? 
                        <RemoveFromPlaylist loggedIn={this.props.loggedIn} id={this.state._id} switchButtons={this.switchButtons} /> : 
                        <AddToPlaylist loggedIn={this.props.loggedIn} id={this.state._id} switchButtons={this.switchButtons} />}
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
                        <Link to={`/track/${props.cell.row.original._id}/update`}><i className="fa fa-edit"></i></Link>
                        <DeleteTrack id={props.cell.row.original._id} />
                    </div>
                )
            }
        },
    ]

    render() {
        const {isLoading} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text={"Loading page..."} />
                }

                {!isLoading &&
                    <div>
                        <MainInfo>
                            <Title title={"Track Details"} />
                            <TableWrapper>
                                <Table columns={this.columns} data={[this.state]}/>
                            </TableWrapper>
                        </MainInfo>
                        <AdditionalInfo>
                            <Video link={this.state.link} title={this.state.title}/>
                            <Lyrics text={this.state.lyrics} />
                        </AdditionalInfo>
                    </div>
                }
            </Main>
        )
    }
}

export default Track