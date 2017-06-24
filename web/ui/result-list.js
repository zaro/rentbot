import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import Waypoint from 'react-waypoint';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'react-toolbox/lib/card';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Button from 'react-toolbox/lib/button';
import Chip from 'react-toolbox/lib/chip';
import AdCard from './ad-card';
import {newSearch, startSearch, searchResultsAvailable, addFavourite, removeFavourite} from './actions'
import {search} from './api';

const Message = ({text, children})=>{
  return (
    <div style={styles.centerDiv}>
      <p style={styles.stateMessage}>{text}</p>
      {children}
    </div>
  );
}

const ResultListComponent = ({totalAdCount, searchResults, next, showNewest, favourites, addFavourite, removeFavourite}) => {
  if( searchResults.searching === undefined ) {
    if (totalAdCount >= 0) {
      return (
        <Message text={`Търси в ${totalAdCount} обяви`} >
          <Button flat primary={true} onTouchTap={showNewest}>Покажи най-новите обяви</Button>
        </Message>
      );
    } else {
      return <Message text="Инициализиране ..." />;
    }
  }
  if (!searchResults.results || searchResults.results.length === 0) {
    if (searchResults.searching) {
      return (
        <div style={styles.centerDiv}>
          <ProgressBar type="circular" mode="indeterminate"/>
        </div>
      );
    } else {
      return (
        <Message text="Няма намерени обяви ..." >
          <Button flat primary={true} onTouchTap={showNewest}>Покажи най-новите обяви</Button>
        </Message>
      );
    }
  } else {
    return (
      <div>
        {searchResults.results.map((ad, idx) => (
          <AdCard ad={ad}
            key={ad._id}
            listIndex={idx+1}
            listTotal={searchResults.totalCount}
            isFavourite={favourites[ad._id] ? true : false}
            addFavourite={addFavourite}
            removeFavourite={removeFavourite}
          />
        ))}
        {searchResults.searching ? (
          <div>
            <div style={styles.centerSpinner}>
              <ProgressBar type="circular" />
            </div>
          </div>
        ):(
          <Waypoint
            onEnter={()=> {searchResults.hasMore && next(searchResults)}}
          />
        )}
      </div>
    );
  }
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
    totalAdCount: state.counters.totalAdCount,
    searchResults: state.searchResults,
    favourites: state.favourites,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    next: (searchResults) => {
      dispatch(startSearch(searchResults.query));
      const query = Object.assign({}, searchResults.query);
      query.from = searchResults.results.length;
      search(query).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
    },
    showNewest: () => {
      const query = { q: '*', sortBy: 'time', sortOrder: 'desc' };
      dispatch(newSearch(query));
      search(query).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
    },
    addFavourite: (docId) => {
      dispatch(addFavourite(docId));
    },
    removeFavourite: (docId) => {
      dispatch(removeFavourite(docId));
    }
  }
}

const ResultList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultListComponent)

export default ResultList;
