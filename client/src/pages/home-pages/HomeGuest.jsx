import React, {Component} from 'react';
import {Title, Main, LoadingComponent} from '../../components'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'shadow item py-3'
})``

const Redirector = styled.div.attrs({
    className: 'shadow item py-3 my-3 col-2'
})``

const Welcomer = styled.div.attrs({
    className: 'py-4 px-5 mx-5'
})``

class HomeGuest extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isLoading: true
        }
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({isLoading: false})
        }, 150)
    }

    render() {
        const {isLoading} = this.state
        return (
            <Main>
                {isLoading &&
                    <LoadingComponent text="Loading Page..."/>
                }
                {!isLoading &&
                <>
                    <Content>
                        <Title title={"Welcome To MusicPedia"} />
                        <Welcomer>
                            <p style={styledText}>Welcome to interactive Database where you can check constantly updatated service of recorded bands, their albums and tracks. </p>
                            <div style={styledText}>
                                Join our community by registering and help us by suggesting bands we've forgotten or missed!
                                You will have an access to store and listen to your favourite tracks on your own, self-created Playlist.
                            </div>
                            <div style={styledText} className="text-muted">
                                <p><em>Incoming Updates: </em></p>
                                <p>- real-time chat</p>
                                <p>- being able to listen to one's created Playlist</p>
                            </div>
                        </Welcomer>
                    </Content>
                    <Redirector>
                        <Link to="/register"><h5 className="text-center my-auto">Register now!</h5></Link>
                    </Redirector>
                </>
                }
            </Main>
        )
    }
}

const styledText = {
    marginBottom: '1rem',
    marginTop: '1rem',
    fontSize: '1.25rem',
    textAlign: 'justify',
}

export default HomeGuest;