import React, {Component} from 'react';
import '../../styles'
import { createRef } from 'react';
import LoadingComponent from './LoadingComponent';

class InfoPop extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: false,
            messages: []
        }

        this.boxRef = createRef()
        this.timeout = null
        this.loadingTimer = null
    }

    componentDidMount() {
        if(this.props.submitting) {
            this.setState({isLoading: true})
            this.loadingTimer = setTimeout(() => {
                this.setState({isLoading: false})
                if(this.props.success.length) {
                    this.setState({messages: this.props.success})
                    this.boxRef.current.className = "pop-success"
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.boxRef.current.className = "pop-success hidePop"
                        this.props.switch()
                    }, 5000)
                } else if (this.props.errors.length) {
                    this.setState({messages: this.props.errors})
                    this.boxRef.current.className = "pop-error"
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.boxRef.current.className = "pop-error hidePop"
                        this.props.switch()
                    }, 5000)
                }
            }, 750)
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearTimeout(this.loadingTimer)
    }

    render() {
        return (
                <div className="infoPop">
                    {this.state.isLoading ?
                        <LoadingComponent text={"Processing data..."}/>
                    :
                        <div ref={this.boxRef} className="pop-success hidePop">
                            {
                                this.state.messages.map(one => (
                                    <h5 key={this.state.messages.indexOf(one)}>{one}</h5>
                                ))
                            }
                        </div>
                    }
                </div>
        )
    }
}

export default InfoPop;