import React, {Component} from 'react';
import {Title, Table, Select, Main, Form, LoadingComponent} from '../../components'
import {Link} from 'react-router-dom'
import api from '../../api';
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'shadow item py-3 w-100'
})``

const Info = styled.div.attrs({
    className: 'py-4 px-5 mx-5'
})``

const SubContent = styled.div.attrs({
    className: 'd-flex my-3 w-100'
})``

const Activator = styled.div.attrs({
    className: 'shadow item py-3 col-2'
})``

const Adder = styled.div.attrs({
    className: 'p-2 item mx-3 col-10'
})``

class ToggleButton extends Component {
    render() {
        return (
        this.props.class === 'hide' ? 
            <button onClick={this.props.show} className="w-100"><h5 className="text-center my-auto">Add Track</h5></button>
            :
            <button onClick={this.props.hide} className="w-100"><h5 className="text-center my-auto">Enough</h5></button>
        )
    }
}

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
            playlist: [],
            classAttr: 'hide',
            bands: [],
            albums: [],
            tracks: [],
            trackToAdd: {
                band_id: '',
                album_id: '',
                _id: '',
                band_name: '',
                album_name: '',
                title: '',
                duration: ''
            },
            isLoading: true
        }
    }

    showTracks = () => {
        this.setState({classAttr: ''})
        this.getBands()
    }

    hideTracks = () => {
        this.setState({classAttr: 'hide', bands: []})
    }

    loadData = (data, category) => {
        let array = []
        data.map(single => array.push({
            id: single._id,
            name: 
                `
                    ${single.band_name || single.album_name || single.title} 
                    ${category === "bands" ? `| ${single.country_origin} ` : " "}
                    ${category === "bands" ? `| ${single.year_formed} ` : " "}
                `,
            value: single._id
        }))
        this.setState({[category]: array})
    }

    onChange = (e) => {
        this.setState({
            trackToAdd: {
                ...this.state.trackToAdd,
                [e.target.name]: e.target.value
            }
        })
        if(e.target.name === "band_id") {
            this.getAlbums(e.target.value)
        }
        if(e.target.name === "album_id") {
            this.getTracks(e.target.value)
        }
    }

    getBands = async () => {
        await api.getBands()
        .then((res) => this.loadData(res.data, "bands"))
        .catch(() => this.setState({bands: []}))
    }

    getAlbums = async (id) => {
        await api.getAlbumsByBand(id)
        .then((res) => this.loadData(res.data[0].albums, "albums"))
        .catch(() => this.setState({albums: []}))
        this.setState({
            trackToAdd: {
                ...this.state.trackToAdd,
                track_id: ""
            }
        })
    }

    getTracks = async (id) => {
        await api.getTracksByAlbumId(id)
        .then((res) => this.loadData(res.data[0].tracks, "tracks"))
        .catch(() => this.setState({tracks: []}))
    }

    addToPlaylist = async () => {
        let cookie = document.cookie.substring(9)
        await api.addToPlaylist(this.state.trackToAdd._id, cookie)
        .then((res) => {
            if(res.data) {
                this.addTrack()
            }
        })
    }

    removeTrack = (id) => {
        this.setState({playlist: this.state.playlist.filter(function(track) { 
            return track._id !== id
        })});
    }

    addTrack = async () => {
        await api.getTrackById(this.state.trackToAdd._id)
        .then((res) => {
            const {band_name, album_name, title, duration} = res.data[0]
            this.setState({
                trackToAdd: {
                    ...this.state.trackToAdd,
                    band_name: band_name,
                    album_name: album_name,
                    title: title,
                    duration: duration
                }
            })
            this.setState({playlist: this.state.playlist.concat(this.state.trackToAdd)});
            this.setState({
                trackToAdd: {
                    band_id: '',
                    album_id: '',
                    _id: '',
                    band_name: '',
                    album_name: '',
                    title: '',
                    duration: ''
                }
            })
        })
    }

    initLoad = () => {
        return new Promise (async (resolve, reject) => {
            await api.displayPlaylist(document.cookie.substring(9))
            .then((res) => {
                if(res.data) {
                    res.data.map(track => {
                        return this.setState({playlist: [...this.state.playlist, {
                            ...track,
                            id: res.data.indexOf(track)+1,
                        }]})
                    })
                }
                resolve()
            })
            .catch(() => reject())
        })
    }

    componentDidMount = async () => {
        this.initLoad()
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
        const {classAttr, playlist, trackToAdd, bands, albums, tracks, isLoading} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text="Loading page..."/>
                }
                {!isLoading &&
                <div>
                    <Content>
                        <Title title={"Your Playlist"} />
                        <Info>
                            {
                                playlist.length > 0 ? 
                                <Table columns={columns} data={playlist} remove={this.removeTrack} /> :
                                <h4 className="text-muted">
                                    It seems that you have no tracks in your Playlist. 
                                    If you find your favourite track in our Database, simply click on the Add button in a track details. 
                                    After that you will be able to see it here.
                                </h4>
                            }
                        </Info>
                    </Content>
                    <SubContent>
                        <Activator>
                            <ToggleButton class={classAttr} show={this.showTracks} hide={this.hideTracks}/>
                        </Activator>
                        <Adder className={classAttr}>
                                <Form onSubmit={this.addToPlaylist}>
                                    <Title title={"Add Track"} />
                                    <Select 
                                        title={"Band"} mandatory name={"band_id"} type={"text"} array={bands}
                                        value={trackToAdd.band_id} onChange={this.onChange} />
                                    <Select 
                                        title={"Album"} mandatory name={"album_id"} type={"text"} array={albums}
                                        value={trackToAdd.album_id} onChange={this.onChange} />
                                    <Select 
                                        title={"Track"} mandatory name={"_id"} type={"text"} array={tracks}
                                        value={trackToAdd._id} onChange={this.onChange} />
                                    <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                        <button type="submit" className="w-100">Submit</button>
                                    </div>
                                </Form>
                        </Adder>
                    </SubContent>
                </div>
                }
            </Main>
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