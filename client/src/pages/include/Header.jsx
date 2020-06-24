import React, {Component, createRef} from 'react';
import '../../styles/header.css'
import api from '../../api';
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            wrapped: 1,
            user_name: '',
            user_password: '',
            loggedIn: false
        }

        this.formRef = createRef()
        this.buttonRef = createRef()
    }

    createIcon = (direction) => {
        let icon = document.createElement("i")
        icon.classList.add("fa", `fa-angle-double-${direction}`, "mt-1")
        return icon
    }

    hidePanel = (e) => {
        let form = this.formRef.current
        let button = this.buttonRef.current

        if(this.state.wrapped === 1) {
            button.innerHTML = ""
            button.appendChild(this.createIcon("left"))
            this.setState({wrapped: 0})
            setTimeout(() => {
                form.classList.remove("hide")
                if(!this.state.loggedIn) {
                    form.children[0][0].focus()
                }
            }, 600)
        } else {
            button.innerHTML = ""
            button.appendChild(this.createIcon("right"))
            this.setState({wrapped: 1})
            setTimeout(() => {
                form.classList.add("hide")
            }, 150)
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    logIn = async (e) => {
        e.preventDefault()

        const {user_name, user_password} = this.state
        await api.logIn({user_name, user_password})
        .then((response) => {
            if(response.data.message.includes("Invalid")) {
                alert("Invalid username / password")
            } else {
                Cookies.set(`loggedIn`, response.data.token)
                this.setState({
                    wrapped: 0,
                    user_name: '',
                    user_password: '',
                    loggedIn: true
                })
                this.props.loggedIn(true)
                console.log("Logged In Successfully.")
            }
        })
        .catch(() => {
            alert("Invalid username / password")
        })
    }

    logOut = async () => {
        var user = Cookies.get('loggedIn')
        await api.logOut({user})
        .then((response) => {
            this.setState({loggedIn: false})
            this.props.loggedIn(false)
            Cookies.set(`loggedIn`, response.data)
        })
    }

    componentDidMount = async () => {
        var user = Cookies.get('loggedIn')
        await api.checkIfLoggedIn({user})
        .then((response) => {
            if(response.data) {
                this.setState({
                    loggedIn: true
                })
                console.log("Logged In!")
                this.props.loggedIn(true)
            } else {
                Cookies.remove('loggedIn')
                console.log("Not logged in...")
            }
        })
    }

    render() {
        return (
            <div className="d-flex fluid-container my-3" id="header-container">
                <div className="d-flex p-0 shadow" id="header" style={this.state.wrapped ? wrapped : (this.state.loggedIn ? unwrappedLogIn: unwrapped)}>
                    <div className="row align-items-center mx-0 h-100 w-100">
                        <div className="d-flex col-12 justify-content-between mx-0">
                            <div className="d-flex w-50 py-2 title text-muted" id="title"><Link to="/home">MusicPedia</Link></div>
                            {this.state.loggedIn ? 
                            <div className="d-flex w-100 py-2 hide" ref={this.formRef} id="formArea">
                                <button className="btn-log-in mx-1" onClick={this.logOut}>Log Out</button>
                            </div>
                            :
                            <div className="d-flex w-100 py-2 hide" ref={this.formRef} id="formArea">
                                <form onSubmit={this.logIn} className="d-flex mx-1" action="">
                                    <input className="mx-1 w-100" type="text" name="user_name" value={this.state.user_name || ""} onChange={this.onChange} placeholder="Username"/>
                                    <input className="mx-1 w-100" type="password" name="user_password" value={this.state.user_password || ""} onChange={this.onChange} placeholder="Password"/>
                                    <button className="btn-log-in mx-1">Log In</button>
                                </form>
                            </div>
                            }
                            <div className="d-flex px-1 py-2"><button ref={this.buttonRef} onMouseDown={this.hidePanel} id="wrapper" value={0}><i className="fa fa-angle-double-right mt-1"></i></button></div>
                        </div>
                    </div>
                </div>

                <div className="d-flex p-1 shadow" id="banner">
                        <div className="d-flex col-12 justify-content-center text-center">
                            
                        </div>
                </div>
            </div>
        )
    }
}

const unwrapped = {
    width: "1000px", 
    borderColor: "#666"
}

const unwrappedLogIn = {
    width: "400px", 
    borderColor: "#666"
}

const wrapped = {
    width: "200px", 
}

export default Header;