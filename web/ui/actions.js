export const TOTAL_AD_COUNT = 'TOTAL_AD_COUNT';
export const START_SEARCH = 'START_SEARCH';
export const SEARCH_RESULTS_AVAILABLE = 'SEARCH_RESULTS_AVAILABLE';
export const NEW_SEARCH = 'NEW_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const LOAD_FAVOURITES = 'LOAD_FAVOURITES';
export const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const REMOVE_FAVOURITE = 'REMOVE_FAVOURITE';
export const FAVOURITES_AVAILABLE = 'FAVOURITES_AVAILABLE';

import {DEFAULT_SEARCH} from './api';

export
function totalAdCount(totalAdCount) {
  return { type: TOTAL_AD_COUNT, totalAdCount};
}

export
function startSearch(query) {
  return { type: START_SEARCH, query };
}

export
function newSearch(query) {
  return { type: NEW_SEARCH, query };
}

export
function clearSearch() {
  return { type: CLEAR_SEARCH, query: Object.assign({}, DEFAULT_SEARCH) };
}

export
function searchResultsAvailable(searchResults, totalCount) {
  return { type: SEARCH_RESULTS_AVAILABLE, searchResults, totalCount};
}

export
function loadFavourites() {
  return { type: LOAD_FAVOURITES};
}

export
function addFavourite(docId) {
  return { type: ADD_FAVOURITE, docId};
}

export
function removeFavourite(docId) {
  return { type: REMOVE_FAVOURITE, docId};
}

export
function favouritesAvailable(favouritesList) {
  return { type: FAVOURITES_AVAILABLE, favouritesList};
}
