import React, {Component} from 'react';
import api from '../../api'
import {Table} from '../../components'
import {Main, Title} from '../../components'

class BandsList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bands: []
        }
    }

    componentDidMount = async () => {
        await api.getBands()
        .then((response) => {
            this.setState({bands: response.data})
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <Main title={"List of Bands"}>
                <div className="item py-3 w-100">
                    <Title title={"Record of Bands"} />
                    <div className="d-flex justify-content-between py-4 px-5 mx-5">
                        <Table category={"band"} columns={columns} data={this.state.bands} />
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