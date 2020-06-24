import React, {Component} from 'react';
import '../../styles/main.css';

class Main extends Component {

    render() {
        return (
            <div className="container-fluid p-0" id="main">
                <div className="row align-items-center justify-content-center mx-0 w-100 h-100">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Main;