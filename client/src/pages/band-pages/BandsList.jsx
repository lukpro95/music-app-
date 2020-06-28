import React, {Component} from 'react';
import api from '../../api'
import {Table} from '../../components'
import {Main, Title, LoadingComponent} from '../../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'item py-3 w-100'
})``

const TableWrapper = styled.div.attrs({
    className: 'd-flex justify-content-between py-4 px-5 mx-5'
})``

class BandsList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bands: [],
            isLoading: true
        }
    }

    loadBands = () => {
        return new Promise(async (resolve) => {
            await api.getBands()
            .then((response) => {
                this.setState({bands: response.data})
                resolve()
            })
        })
    }

    componentDidMount = async () => {
        await this.loadBands()
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
                    <LoadingComponent text="Loading page..."/>
                }
                {!isLoading && 
                    <Content>
                        <Title title={"Record of Bands"} />
                        <TableWrapper>
                            <Table category={"band"} columns={columns} data={this.state.bands} />
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
        Header: "Genre",
        accessor: "genre",
        filterable: true,
    },
    {
        Header: "Country Origin",
        accessor: "country_origin",
        filterable: true,
    },
    {
        Header: "Year Formed",
        accessor: "year_formed",
        filterable: true,
    },
    {
        Header: "Record Label",
        accessor: "record_label",
        filterable: true,
    },
    {
        Header: "Active Status",
        accessor: "active_status",
        filterable: true,
        Cell: function(props) {
            return props.row.original.active_status === 1 ? <div className="active">Active</div> : <div className="not-active">Not Active</div>
        }
    },
]



export default BandsList;