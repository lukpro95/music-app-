import React, {Component} from 'react';
import {Main} from '../../components'
import {HomeGuest, HomeUser} from './'

class Home extends Component {

    render() {
        return (
            <Main>
                {this.props.loggedIn ? 
                <HomeUser />
                :
                <HomeGuest />
                }
            </Main>
        )
    }
}

export default Home;