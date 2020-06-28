import React, {Component} from 'react';

class Form extends Component {

    submitHandler = (e) => {
        e.preventDefault()
        this.props.onSubmit()
    }

    render() {
        return (
            <div className="my-2 w-100 d-flex justify-content-center">
                <form onSubmit={this.submitHandler} className="w-100" action="">
                    {this.props.children}
                </form>
            </div>
        )
    }
}

export default Form;