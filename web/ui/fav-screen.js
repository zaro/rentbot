import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import SearchBar from './search-bar';
import FavList from './fav-list';
import PersistenStorage from './persistent-storage';
import { Link } from 'react-router-dom'

import { getDocuments } from './api';
import {totalAdCount, newSearch, favouritesAvailable, loadFavourites} from './actions';


class FavScreenComponent extends React.Component {
  componentWillMount(){
    this.props.loadFavourites();
  }

  render(){
    return (
      <div>
          <Link to="/">Обратно към търсене..</Link>
          <FavList />
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
    loadFavourites: () => {
      dispatch(loadFavourites());
      const favourites = PersistenStorage.load('favourites');
      if (favourites) {
        getDocuments(Object.keys(favourites)).then((docs) => dispatch(favouritesAvailable(docs, docs.length)))
      }

    },
  }
}

const FavScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavScreenComponent)

export default FavScreen;
