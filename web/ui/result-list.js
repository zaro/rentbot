import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import Waypoint from 'react-waypoint';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';
import Chip from 'material-ui/Chip';
import AdCard from './ad-card';
import {startSearch, searchResultsAvailable} from './actions'
import {search} from './api';

const ResultListComponent = ({totalAdCount, searchResults, next}) => {
  if( searchResults.searching === undefined ) {
    if (totalAdCount >= 0) {
      return (
        <div style={styles.centerDiv}>
          <p style={styles.centerText}> Търси в {totalAdCount} обяви</p>
        </div>
      );
    } else {
      return (
        <div style={styles.centerDiv}>
          <p style={styles.centerText}> Инициализиране ... </p>
        </div>
      );
    }
  }
  if (!searchResults.results || searchResults.results.length === 0) {
    if (searchResults.searching) {
      return (
        <div style={styles.centerDiv}>
          <p style={styles.centerText}>  Търсене ... </p>
        </div>
      );
    } else {
      return (
        <div style={styles.centerDiv}>
          <p style={styles.centerText}> Няма намерени обяви </p>
        </div>
      );
    }
  } else {
    return (
      <div>
        <div style={{float: 'right'}}>{searchResults.results.length}/{searchResults.totalCount}</div>
        {searchResults.results.map((ad) => (
          <AdCard ad={ad} key={`${ad.source}${ad.source_id}`}/>
        ))}
        {searchResults.searching ? (
          <p style={styles.centerText}>  Зареждане ... </p>
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
  },
  centerText: {
    marginTop: '5em',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '13em',
    fontSize: '2em',
    color: 'rgba(55,55,55,0.87)',
  }
}

const mapStateToProps = (state) => {
  return {
    totalAdCount: state.counters.totalAdCount,
    searchResults: state.searchResults,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    next: (searchResults) => {
      dispatch(startSearch(searchResults.query));
      const {q, sortBy, sortOrder} = searchResults.query;
      const from = searchResults.results.length;
      search(q, sortBy, sortOrder, from).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
    }
  }
}

const ResultList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultListComponent)

export default ResultList;
