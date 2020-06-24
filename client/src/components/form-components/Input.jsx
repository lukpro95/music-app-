import React from 'react'

class Input extends React.Component {

    isMandatory = () => {
        return this.props.mandatory ? <span className="mandatory">*</span> : <span></span>
    }

    render() {
        return (
            <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto">
                <h4>{this.props.title} {this.isMandatory()}</h4>
                <input 
                    min={this.props.min}
                    max={this.props.max}
                    onChange={this.props.onChange} 
                    name={this.props.name}
                    type={this.props.type}
                    value={this.props.value} 
                    autoFocus={this.props.focus}
                    className="info" 
                    autoComplete="off" 
                />
            </div>
        )
    }
}

export default Input