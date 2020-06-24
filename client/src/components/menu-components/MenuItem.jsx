import React, {Component} from 'react';
import {Link} from 'react-router-dom'

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
            <div className="mx-3 btn-menu">
                <Link to={`/${this.state.value}`}>{this.state.name}</Link>
            </div>
        )
    }
}

export default MenuItem;