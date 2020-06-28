import React, {Component} from 'react';

class Title extends Component {

    render() {
        return (
            <div className="col-11 mx-auto text-center">
                <h1 className="title">{this.props.title}</h1>
                <hr style={borderStyle} />
            </div>
        )
    }
}

const borderStyle = {
    borderColor: 'rgb(33, 33, 33, 70%)',
    margin: '0',
}

export default Title;