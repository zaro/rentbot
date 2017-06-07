import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chip from 'material-ui/Chip';
import SearchBar from './search-bar';
import ResultList from './result-list';

import { getTotalAdCount } from './api';
import {totalAdCount} from './actions';


class MainScreenComponent extends React.Component {
  componentWillMount(){
    this.props.getTotalAdCount();
  }
  render(){
    return (
        <div>
          <SearchBar/>
          <ResultList/>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTotalAdCount: () => {
      getTotalAdCount().then((response) => {
        dispatch(totalAdCount(response.count));
      })
    }
  }
}

const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenComponent)

export default MainScreen;
