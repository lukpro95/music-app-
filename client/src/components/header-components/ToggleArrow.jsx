import React, {Component} from 'react';
import '../../styles'
import { createRef } from 'react';

class ToggleArrow extends Component {

    constructor(props) {
        super(props)
        this.arrowRef = createRef()
    }
    
    componentDidUpdate = () => {
        !this.props.direction ? 
            this.arrowRef.current.innerHTML = `<i class="fa fa-angle-double-right mt-1"></i>`
            :
            this.arrowRef.current.innerHTML = `<i class="fa fa-angle-double-left mt-1"></i>`
    }

    render() {
        return (
            <div className="d-flex px-1 py-2">
                <button ref={this.arrowRef} onMouseDown={this.props.changeDirection} id="wrapper">
                    <i className="fa fa-angle-double-right mt-1"></i>
                </button>
            </div>
        )
    }
}

export default ToggleArrow;
