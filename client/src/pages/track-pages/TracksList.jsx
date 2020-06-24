import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title} from '../../components'

class TracksList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tracks: []
        }
    }

    componentDidMount = async () => {

        await api.getTracks()
        .then((response) => {
            console.log(response.data)
            this.setState({tracks: response.data})
        })
    }

    render() {
        return (
            <Main>
                <div className="item py-3 w-100">
                    <Title title={"Record of Tracks"} />
                    <div className="d-flex justify-content-between py-4 px-5 mx-5">
                        <Table category={"track"} columns={columns} data={this.state.tracks} />
                    </div>
                </div>
            </Main>
        )
    }
}

const columns = [
    {
        Header: "Band Name",
        accessor: "band_name",
        filterable: true,
    },
    {
        Header: "Title",
        accessor: "title",
        filterable: true,
    },
    {
        Header: "Album",
        accessor: "album_name",
        filterable: true,
    },
    {
        Header: "Duration",
        accessor: "duration",
        filterable: true,
    },
]

export default TracksList;