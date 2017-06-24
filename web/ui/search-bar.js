import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Input from 'react-toolbox/lib/input';
import AutoComplete from 'react-toolbox/lib/autocomplete';
import {RadioButton, RadioGroup} from 'react-toolbox/lib/radio';
import {search, getTotalAdCount} from './api';
import {newSearch, searchResultsAvailable, clearSearch, totalAdCount} from './actions'
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Dropdown from 'react-toolbox/lib/dropdown';
import { MenuItem }  from 'react-toolbox/lib/menu';
import { IconButton }  from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';

const fromPrice =[
  {value:0, label:"~"},
  {value:50, label:"50€"},
  {value:100, label:"100€"},
  {value:200, label:"200€"},
  {value:300, label:"300€"},
  {value:500, label:"500€"},
];

const toPrice =[
  {value:0, label:"~"},
  {value:100, label:"100€"},
  {value:150, label:"150€"},
  {value:200, label:"200€"},
  {value:300, label:"300€"},
  {value:500, label:"500€"},
  {value:1000, label:"1000€"},
];


class SearchBarComponent extends React.Component {
  state = {
    dataSource: [],
  }

  componentWillReceiveProps(nextProps) {
    this.setState({q: null})
  }

  getCurrentQuery() {
    const {searchResults} = this.props;
    const query = Object.assign(
      { q:'', sortBy:'time', sortOrder:'desc', minPrice:0, maxPrice: 0},
      searchResults.query,
      (typeof(this.state.q) === 'string') ? {q: this.state.q} : {},
    );
    return query;
  }

  query = (q) => {
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({}, query, {q}));
  }

  sortOrder = (sortOrder) => {
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({},query, {sortOrder}));
  }

  sortBy = (sortBy) => {
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({},query, {sortBy}));
  }

  minPrice = (minPrice) => {
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({},query, {minPrice}));
  }

  maxPrice = (maxPrice) => {
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({},query, {maxPrice}));
  }

  onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const query = this.getCurrentQuery();
    this.query(query.q);
  }

  render(){
    const query = this.getCurrentQuery();
    return (
      <div><form onSubmit={this.onSubmit}>
        <Input
          type="text"
          label="Търси в обяви"
          value={query.q}
          onChange={(e, value) => {this.setState({q: value})}}
        />
        <AppBar>
          <Navigation>
            <RadioGroup style={styles.radioGroup} name="sortBy" defaultSelected={query.sortBy} onChange={(e, value) => {console.log('onChange');this.sortBy(value)}}>
                <RadioButton
                  style={{ display: 'inline-block', width: '150px' }}
                  value="price_euro"
                  label="Цена"
                />
                <RadioButton
                  style={{ display: 'inline-block', width: '150px' }}
                  value="time"
                  label="Дата"
                />
            </RadioGroup>
          </Navigation>
          <Navigation>
              <IconButton
                onClick={(e) => {this.sortOrder(query.sortOrder == 'asc' ? 'desc': 'asc')}}
                icon={query.sortOrder == 'asc' ? 'keyboard arrow down' : 'keyboard arrow up'}
                label="Сортиране"
              />
          </Navigation>
          <Navigation>
            <span>Цена от</span>
            <Dropdown
              value={query.minPrice}
              onChange={(e, i,value) =>this.minPrice(value)}
              source={fromPrice}
            />
            <span>до</span>
            <Dropdown
              value={query.maxPrice}
              onChange={(e, i,value) => this.maxPrice(value)}
              source={toPrice}
            />
          </Navigation>
          <Navigation>
            <Link to="/fav"><FontIcon className="material-icons">favorite</FontIcon></Link>
            <IconButton onTouchTap={this.props.clearSearch}><FontIcon value='clear'/></IconButton>
          </Navigation>
      </AppBar>
    </form></div>
    );
  }
}

const styles = {
  radioGroup: {
    display: 'inline-block',
    width: '300px',

  },
};


const mapStateToProps = (state) => {
  return {
    totalAdCount: state.counters.totalAdCount,
    searchResults: state.searchResults,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    search: (query) => {
      dispatch(newSearch(query));
      search(query).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
    },
    clearSearch: () =>{
      dispatch(clearSearch());
      getTotalAdCount().then((response) => {
        dispatch(totalAdCount(response.count));
      })
    }
  }
}

const SearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBarComponent)


export default SearchBar;
