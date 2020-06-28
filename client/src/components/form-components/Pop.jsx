import React, {Component} from 'react';
import '../../styles'
import { createRef } from 'react';

class Pop extends Component {

    constructor(props) {
        super(props)

        this.popRef = createRef()
    }

    componentDidUpdate = () => {
        this.props.error ? this.popRef.current.classList.add("show") : this.popRef.current.classList.remove("show")
    }

    render() {
        return (
            <div className="popup">
                <div ref={this.popRef} className="popuptext d-flex"><span className="my-auto">{this.props.error}</span></div>
            </div> 
        )
    }
}

export default Pop;