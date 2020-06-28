import React, {Component} from 'react';
import api from '../../api'
import {Table, Main, Title, LoadingComponent} from '../../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

const TableWrapper = styled.div.attrs({
    className: 'd-flex justify-content-between py-4 px-5 mx-5'
})``

class TracksList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tracks: [],
            isLoading: true,
        }
    }

    loadTracks = () => {
        return new Promise(async (resolve) => {
            await api.getTracks()
            .then((response) => {
                this.setState({tracks: response.data})
                resolve()
            })
        })
    }

    componentDidMount = async () => {
        await this.loadTracks()
        .then(() => {
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
                    <LoadingComponent text={"Loading page..."} />
                }
                
                {!isLoading &&
                    <Content>
                        <Title title={"Record of Tracks"} />
                        <TableWrapper>
                            <Table category={"track"} columns={columns} data={this.state.tracks} />
                        </TableWrapper>
                    </Content>
                }
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