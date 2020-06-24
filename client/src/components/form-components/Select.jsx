import React from 'react'

class Select extends React.Component {

    isMandatory = () => {
        return this.props.mandatory ? <span className="mandatory">*</span> : <span></span>
    }

    render() {
        return (
            <div className="d-flex justify-content-between mx-auto my-4 w-50 mx-auto">
                <h4>{this.props.title} {this.isMandatory()}</h4>
                <select onChange={this.props.onChange} className="info" name={this.props.name} value={this.props.value} ref={this.props.parentRef}>
                    <option value={"DEFAULT"} hidden>Choose an option</option>
                    {
                        this.props.array.map(item =>  (
                            <option key={item.id} value={item.value}>{item.name}</option>
                        ))
                    }
                </select>
            </div>
        )
    }
}

export default Select