import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import api from '../api';
import Cookies from 'js-cookie'

import {
    Header, Footer, Menu, 
    Register, HomeUser, HomeGuest, NoPermission,
    BandsList, TracksList, Track, Band, Album, 
    UpdateTrack, UpdateBand, UpdateAlbum, InsertBand, InsertTrack, 
  } from '../pages'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      isLoading: true,
    }

  }

  logIn = (state) => {
    if(state) {this.setState({loggedIn: true})} else {this.setState({loggedIn: false})}
  }

  loadCookie = () => {
    return new Promise (async (resolve) => {
      var user = Cookies.get('loggedIn')
      await api.checkIfLoggedIn({user})
      .then((response) => {
          if(response.data) {
              this.setState({
                  loggedIn: true
              })
              this.logIn(true)
          } else {
              Cookies.remove('loggedIn')
          }
          resolve()
      })
    })
  }

  componentDidMount = async () => {
    await this.loadCookie()
    .then(()=> {
      this.setState({isLoading: false})
    })
  }

  render() {
    return (
      <div>
        {!this.state.isLoading &&
          <div>
            <Router>
              <Header logIn={this.logIn} isLogged={this.state.loggedIn}/>
              <div className="d-flex">
                
                <Menu data={data} />
    
                <Route exact path="/"     component={this.state.loggedIn ? HomeUser : HomeGuest} />
                <Route exact path="/home" component={this.state.loggedIn ? HomeUser : HomeGuest} />
    
                <Route exact path="/add-bands"        component={this.state.loggedIn ? InsertBand   : NoPermission} />
                <Route exact path="/add-tracks"       component={this.state.loggedIn ? InsertTrack  : NoPermission} />
                <Route exact path="/album/:id/update" component={this.state.loggedIn ? UpdateAlbum  : NoPermission} />
                <Route exact path="/track/:id/update" component={this.state.loggedIn ? UpdateTrack  : NoPermission} />
                <Route exact path="/band/:id/update"  component={this.state.loggedIn ? UpdateBand   : NoPermission} />
    
                <Route exact path="/register"     component={Register} />
                <Route exact path="/view-bands"   component={BandsList} />
                <Route exact path="/view-tracks"  component={TracksList} />
                <Route exact path="/band/:id"     component={Band} />
                <Route exact path="/album/:id"    component={Album} />
    
                <Route exact path="/track/:id" render={(props) => (
                  <Track {...props} key={props.match.params.id} loggedIn={this.state.loggedIn}/>
                )}/>
    
              </div>
            </Router>
            <Footer />
          </div>
        }
      </div>
    );
  }

}

const data = [
  {
    name: 'Bands',
    category: 'View'
  },
  {
    name: 'Tracks',
    category: 'View'
  },
  {
    name: 'Bands',
    category: 'Add'
  },
  {
    name: 'Tracks',
    category: 'Add'
  }
]

export default App;
