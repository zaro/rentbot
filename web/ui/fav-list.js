import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import AdCard from './ad-card';
import LoadingCard from './loading-card'
import {addFavourite, removeFavourite} from './actions'
import {search} from './api';

const FavListComponent = ({favourites, addFavourite, removeFavourite}) => {
    let results = [];
    for(const key in favourites) {
      const doc = favourites[key];
      results.push( doc )
    }
    results = results.sort((a, b) => {
      if (a.import_date < b.import_date) {
        return -1;
      }
      if (a.import_date > b.import_date) {
        return 1;
      }
      return 0;
    });
    if (results.length == 0) {
      return (
        <div style={styles.centerDiv}>
          <p style={styles.stateMessage}>Нямате любими обяви</p>
        </div>
      );
    }
    return (
      <div>
        {results.map((ad, idx) => {
          if (ad._id) {
            return (<AdCard ad={ad}
              key={ad._id}
              listIndex={idx+1}
              listTotal={results.length}
              isFavourite={favourites[ad._id] ? true : false}
              addFavourite={addFavourite}
              removeFavourite={removeFavourite}
            />);
          }
          return <LoadingCard key={idx} />;
        })}
      </div>
    );
}


const styles = {
  centerDiv: {
    width: '100%',
    textAlign: 'center',
  },
  stateMessage: {
    marginTop: '5em',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '35%',
    fontSize: '2em',
    color: 'rgba(55,55,55,0.87)',
    textAlign: 'center',
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '35%',
    fontSize: '1.5em',
    color: 'rgba(55,55,55,0.87)',
    textAlign: 'center',
  },
  centerSpinner: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

const mapStateToProps = (state) => {
  return {
    favourites: state.favourites,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addFavourite: (docId) => {
      dispatch(addFavourite(docId));
    },
    removeFavourite: (docId) => {
      dispatch(removeFavourite(docId));
    }
  }
}

const FavList = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavListComponent)

export default FavList;
