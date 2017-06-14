import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import SearchBar from './search-bar';
import ResultList from './result-list';
import PersistenStorage from './persistent-storage';

import { getTotalAdCount, search} from './api';
import {totalAdCount, newSearch, searchResultsAvailable, loadFavourites} from './actions';


class SearchScreenComponent extends React.Component {
  componentWillMount(){
    this.props.initialSearch();
    this.props.initFavourites();
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
    },
    initFavourites: () => {
      dispatch(loadFavourites())
    }
  }
}

const SearchScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchScreenComponent)

export default SearchScreen;
