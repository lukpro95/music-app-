import React from 'react'

class Input extends React.Component {

    isMandatory = () => {
        return this.props.mandatory ? <span className="mandatory">*</span> : <span></span>
    }

    render() {
        return (
            <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto">
                <h4 className="m-0">{this.props.title} {this.isMandatory()}</h4>
                <textarea 
                    onChange={this.props.onChange} 
                    name={this.props.name}
                    value={this.props.value} 
                    autoFocus={this.props.focus}
                    className="info text-area" 
                    autoComplete="off"
                ></textarea>
            </div>
        )
    }
}

export default Input