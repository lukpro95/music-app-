import React, { Component } from 'react'

class Logger extends Component {
    render() {
        return (
            <div>
                {this.props.loggedIn && 
                    <div className={`d-flex w-100 py-2 ${this.props.classAttr}`} id="formArea">
                        <button className="btn-log-in mx-1" onClick={this.props.logOut}>Log Out</button>
                    </div>
                }
                {!this.props.loggedIn &&
                    <div className={`d-flex w-100 py-2 ${this.props.classAttr}`} id="formArea">
                        <form onSubmit={this.props.logIn} className="d-flex mx-1" action="">
                            <input ref={this.props.focusRef} className="mx-1 w-100" type="text" name="user_name" value={this.props.user_name || ""} onChange={this.props.onChange} placeholder="Username" autoComplete="off"/>
                            <input className="mx-1 w-100" type="password" name="user_password" value={this.props.user_password || ""} onChange={this.props.onChange} placeholder="Password" autoComplete="off"/>
                            <button className="btn-log-in mx-1">Log In</button>
                        </form>
                    </div>
                }
            </div>
        )
    }
}

export default Logger