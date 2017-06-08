import PersistenStorage from './persistent-storage';
import { combineReducers } from 'redux';
import { TOTAL_AD_COUNT, START_SEARCH, SEARCH_RESULTS_AVAILABLE, SEARCH_RESULTS_NEXT, NEW_SEARCH, CLEAR_SEARCH } from './actions'

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
      PersistenStorage.save('lastQuery', null);
      return {results: [], totalCount: 0};
    default:
      return state;
  }
}


const rentbotApp = combineReducers({
  counters,
  searchResults
})

export default rentbotApp;
