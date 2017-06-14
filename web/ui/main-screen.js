import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import FavScreen from './fav-screen';
import SearchScreen from './search-screen';



const MainScreen = () =>  {
    return (
      <Router>
        <div>
          <Route exact path="/" component={SearchScreen}/>
          <Route path="/fav" component={FavScreen}/>
        </div>
      </Router>
    );
}

export default MainScreen;
