import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chip from 'material-ui/Chip';
import MainScreen from './main-screen';
import ResultList from './result-list';

import { createStore } from 'redux'
import rentbotApp from './reducers'
import { getTotalAdCount } from './api';
import {totalAdCount} from './actions';

const store = createStore(rentbotApp);

class App extends React.Component {
  componenWillMount(){

  }
  render(){
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <MainScreen/>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
