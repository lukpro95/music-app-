import React, {Component, createRef} from 'react';
import '../../styles/header.css'
import api from '../../api';
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {Pop, ToggleArrow, Logger} from '../../components'
import styled from 'styled-components'

const Container = styled.div.attrs({
    className: 'd-flex fluid-container my-3', 
    id: 'header-container'
})``

const Wrapper = styled.div.attrs({
    className: 'd-flex p-0 shadow', 
    id: 'header'
})``

const Banner = styled.div.attrs({
    className: 'd-flex px-3 shadow justify-content-right',
    id: 'banner'
})``

const LogWrapper = styled.div.attrs({
    className: 'd-flex col-12 justify-content-between mx-0'
})``

const HomeTitle = styled.div.attrs({
    className: 'd-flex w-50 py-2 px-1 title',
    id: 'title'
})``

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            active: false,
            user_name: '',
            user_password: '',
            loggedIn: false,
            classAttr: 'hide',
            error: '',
            lastTracks: []
        }

        this.popTimeout = null
        this.focusRef = createRef()
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value, error: ''})
    }

    changeDirection = () => {
        if(!this.state.active) { 
            this.setState({active: true})
            setTimeout(() => {
                this.setState({classAttr: ''})
            }, 600)
        } else {
            this.setState({active: false})
            setTimeout(() => {
                this.setState({classAttr: 'hide'})
            }, 150)
        }
    }

    showError = (error) => {
        this.setState({error: error})
        clearTimeout(this.popTimeout)
        this.popTimeout = setTimeout(() => {
            this.setState({error: ""})
        }, 5000)
    }

    logIn = async (e) => {
        e.preventDefault()
        const {user_name, user_password} = this.state
        await api.logIn({user_name, user_password})
        .then((response) => {
            if(response.data.message.includes("Invalid")) {
                this.showError("Invalid username / password")
            } else {
                Cookies.set(`loggedIn`, response.data.token)
                this.setState({
                    active: false,
                    classAttr: 'hide',
                    user_name: '',
                    user_password: '',
                    loggedIn: true
                })
                this.props.logIn(true)
            }
        })
        .catch(() => {
            this.showError("Invalid username / password")
        })
    }

    logOut = async () => {
        var user = Cookies.get('loggedIn')
        await api.logOut({user})
        .then((response) => {
            this.setState({loggedIn: false})
            this.props.logIn(false)
            Cookies.set(`loggedIn`, response.data)
        })
    }

    componentWillUnmount = () => {
        clearTimeout(this.popTimeout)
    }

    componentDidMount = async () => {
        this.setState({loggedIn: this.props.isLogged})
        await api.getLastAddedTracks()
        .then((res) => {
            this.setState({lastTracks: res.data})
        })
        .catch(err => {
            console.log("error")
        })
    }

    render() {
        const {loggedIn, classAttr, user_name, user_password, error, active, lastTracks} = this.state
        return (
            <Container>
                <Wrapper style={active ? (loggedIn ? unwrappedLogIn : unwrapped) : wrapped}>
                    <LogWrapper>
                        <HomeTitle><Link to="/home">MusicPedia</Link></HomeTitle>
                        <Logger 
                            loggedIn={loggedIn} 
                            classAttr={classAttr}
                            user_name={user_name}
                            user_password={user_password}
                            focusRef={this.focusRef}
                            logIn={this.logIn}
                            logOut={this.logOut}
                            onChange={this.onChange}
                        />
                        <ToggleArrow direction={active} changeDirection={this.changeDirection}/>
                    </LogWrapper>
                </Wrapper>
                <Pop error={error}/>
                <Banner>
                    <div className="my-auto reversing go">Last tracks added... &nbsp; 
                        {lastTracks.map(track => <span key={track._id} > <i className="fa fa-music red"></i> &nbsp; <Link to={`/track/${track._id}`}>{track.band_name}: {track.title}</Link> &nbsp;</span>)}
                    </div>
                </Banner>
            </Container>
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