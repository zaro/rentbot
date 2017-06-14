import PersistenStorage from './persistent-storage';
import { combineReducers } from 'redux';
import { TOTAL_AD_COUNT,
        START_SEARCH, SEARCH_RESULTS_AVAILABLE, SEARCH_RESULTS_NEXT,
        NEW_SEARCH, CLEAR_SEARCH,
        LOAD_FAVOURITES, ADD_FAVOURITE, REMOVE_FAVOURITE, FAVOURITES_AVAILABLE } from './actions';

function counters(state={}, action) {
  switch (action.type) {
    case TOTAL_AD_COUNT:
      return Object.assign({}, state, { totalAdCount: action.totalAdCount});
      break;
    default:
      return state;
  }
}

function searchResults(state={}, action) {
  switch (action.type) {
    case START_SEARCH:
      return Object.assign({}, state, {searching: true, query: action.query});
    case SEARCH_RESULTS_AVAILABLE:
      const current = state.results || [];
      const results = current.concat(action.searchResults)
      const newState = {
        searching: false,
        results: results,
        totalCount: action.totalCount,
        hasMore: action.totalCount > results.length,
      };
      return Object.assign({}, state, newState);
    case NEW_SEARCH:
      PersistenStorage.save('lastQuery', action.query);
      return {searching: true, results: [], totalCount: 0, query: action.query};
      break;
    case CLEAR_SEARCH:
      if( !action.temporary ){
        PersistenStorage.save('lastQuery', null);
      }
      return {results: [], totalCount: 0};
    default:
      return state;
  }
}

function favourites(state={}, action) {
  switch (action.type) {
    case LOAD_FAVOURITES:
      return PersistenStorage.load('favourites') || {};
    case ADD_FAVOURITE: {
      if (!(action.docId in state)) {
        const newState = Object.assign({}, state, {[action.docId]: 1});
        PersistenStorage.save('favourites', newState);
        return newState;
      }
      return state;
    }
    case REMOVE_FAVOURITE: {
      const newState = Object.assign({}, state);
      delete newState[action.docId]
      PersistenStorage.save('favourites', newState);
      return newState;
    }
    case FAVOURITES_AVAILABLE: {
      const newState = Object.assign({}, state);
      for(const doc of action.favouritesList) {
        newState[doc._id] = doc;
      }
      return newState;
    }
    default:
      return state;
  }
}


const rentbotApp = combineReducers({
  counters,
  searchResults,
  favourites,
})

export default rentbotApp;
