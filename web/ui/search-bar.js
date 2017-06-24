import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Input from 'react-toolbox/lib/input';
import AutoComplete from 'react-toolbox/lib/autocomplete';
import {RadioButton, RadioGroup} from 'react-toolbox/lib/radio';
import {search, getTotalAdCount} from './api';
import {newSearch, searchResultsAvailable, clearSearch, totalAdCount} from './actions'
import { Grid, Row, Col } from 'react-flexbox-grid';
import Navigation from 'react-toolbox/lib/navigation';
import Dropdown from 'react-toolbox/lib/dropdown';
import { MenuItem }  from 'react-toolbox/lib/menu';
import { IconButton, Button }  from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';
import inlineRadioTheme from './css/inline_radio.css';

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
    console.log(query);
    return (
      <form onSubmit={this.onSubmit}>
      <Grid fluid>
        <Row middle="xs" center="xs">
            <Col xs={10}>
              <Input
                type="text"
                label="Търси в обяви"
                value={query.q}
                onChange={(value) => { this.setState({q: value})}}
              />
            </Col>
            <Col xs={1} >
              <IconButton onClick={this.props.clearSearch}><FontIcon value='clear'/></IconButton>
            </Col>
            <Col xs={1} >
              <IconButton
                type="submit" icon='search'
              />
            </Col>
        </Row>
        <Row middle="xs">
          <Col xs={2} >
            <RadioGroup name="sortBy" value={query.sortBy} onChange={(value) => {console.log('onChange');this.sortBy(value)}}>
                <RadioButton theme={inlineRadioTheme} value="price_euro" label="Цена" />
                <RadioButton theme={inlineRadioTheme} value="time" label="Дата" />
            </RadioGroup>
          </Col>
          <Col xs={1}>
              <Button
                onClick={(e) => {this.sortOrder(query.sortOrder == 'asc' ? 'desc': 'asc')}}
              >Сортиране</Button>
          </Col>
          <Col xs={1}>
              <IconButton
                onClick={(e) => {this.sortOrder(query.sortOrder == 'asc' ? 'desc': 'asc')}}
                icon={query.sortOrder == 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
              />
          </Col>
          <Col xs={1}>
            <span>Цена от</span>
          </Col>
          <Col xs={1}>
            <Dropdown
              value={query.minPrice}
              onChange={this.minPrice}
              source={fromPrice}
            />
          </Col>
          <Col xs={1}>
            <span>до</span>
          </Col>
          <Col xs={1}>
            <Dropdown
              value={query.maxPrice}
              onChange={this.maxPrice}
              source={toPrice}
            />
          </Col>
          <Col  xsOffset={3} xs={1}>
            <Link to="/fav"><FontIcon className="material-icons">favorite</FontIcon></Link>
          </Col>
      </Row>
    </Grid>
    </form>
    );
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
