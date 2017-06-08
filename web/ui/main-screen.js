import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Chip from 'material-ui/Chip';
import PersistenStorage from './persistent-storage';
import SearchBar from './search-bar';
import ResultList from './result-list';

import { getTotalAdCount, search} from './api';
import {totalAdCount, newSearch, searchResultsAvailable} from './actions';


class MainScreenComponent extends React.Component {
  componentWillMount(){
    this.props.initialSearch();
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
    initialSearch: () => {
      const startQuery = PersistenStorage.load('lastQuery');
      if (startQuery && startQuery.q) {
        dispatch(newSearch(startQuery));
        search(startQuery).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
      } else {
        getTotalAdCount().then((response) => {
          dispatch(totalAdCount(response.count));
        })
      }
    }
  }
}

const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenComponent)

export default MainScreen;
