import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

import {Header, Footer, Menu, Register, Home, BandsList, TracksList, 
  InsertBand, InsertTrack, Track, Band, Album, 
  UpdateTrack, UpdateBand, UpdateAlbum} from '../pages'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false
    }

  }

  loggedIn = (state) => {
    if(state) {this.setState({loggedIn: true})} else {this.setState({loggedIn: false})}
  }

  render() {
    return (
      <div>
        <Router>

          <Header loggedIn={this.loggedIn}/>

          <div className="d-flex">
            <Menu data={data} />

            <Route exact path="/home" render={() => (
              <Home loggedIn={this.state.loggedIn}/>
            )}/>
            <Route exact path="/" render={() => (
              <Home loggedIn={this.state.loggedIn}/>
            )}/>
            <Route exact path="/track/:id" render={(props) => (
              <Track {...props} loggedIn={this.state.loggedIn}/>
            )}/>

            <Route exact path="/register" component={Register} />
            <Route exact path="/view-bands" component={BandsList} />
            <Route exact path="/view-tracks" component={TracksList} />
            <Route exact path="/add-bands" component={InsertBand} />
            <Route exact path="/add-tracks" component={InsertTrack} />
            <Route exact path="/album/:id" component={Album} />
            <Route exact path="/album/:id/update" component={UpdateAlbum} />
            <Route exact path="/track/:id/update" component={UpdateTrack} />
            <Route exact path="/band/:id/update" component={UpdateBand} />
            <Route exact path="/band/:id" component={Band} />
          </div>

        </Router>
        <Footer />
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
