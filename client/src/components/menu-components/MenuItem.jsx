import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const ItemWrapper = styled.div.attrs({
    className: "mx-3 btn-menu"
})``

class MenuItem extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            value: '',
        }
    }

    componentDidMount = () => {
        this.setState({value: this.props.value, name: this.props.menu.name})
    }

    render() {
        return (
            <ItemWrapper>
                <Link to={`/${this.state.value}`}>{this.state.name}</Link>
            </ItemWrapper>
        )
    }
}

export default MenuItem;