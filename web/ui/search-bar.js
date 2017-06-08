import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import {search, getTotalAdCount} from './api';
import {newSearch, searchResultsAvailable, clearSearch, totalAdCount} from './actions'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import IconClear from 'material-ui/svg-icons/content/clear';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

class SearchBarComponent extends React.Component {
  state = {
    dataSource: [],
  }

  getCurrentQuery() {
    const {searchResults} = this.props;
    const query = Object.assign({ q:'', sortBy:'time', sortOrder:'desc', minPrice:0, maxPrice: 0}, searchResults.query)
    return query;
  }

  query = (q) => {
    console.log(q);
    const query = this.getCurrentQuery();
    this.props.search(Object.assign({},query, {q}));
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
    this.query(this.qField.getInputNode().value);
  }

  render(){
    const query = this.getCurrentQuery();
    return (
      <div><form onSubmit={this.onSubmit}>
        <TextField
          floatingLabelText="Търси в обяви"
          fullWidth={true}
          value={query.q}
          ref={(ref) => {this.qField = ref}}
        />
        <Toolbar>
          <ToolbarGroup>
            <RadioButtonGroup style={styles.radioGroup} name="sortBy" defaultSelected={query.sortBy} onChange={(e, value) => {console.log('onChange');this.sortBy(value)}}>
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
            </RadioButtonGroup>
          </ToolbarGroup>
          <ToolbarGroup>
              <Checkbox
                onCheck={(e, isChecked) => {console.log('onChange');this.sortOrder(isChecked ? 'desc': 'asc')}}
                checkedIcon={<ArrowUpward />}
                uncheckedIcon={<ArrowDownward />}
                label="Сортиране"
                checked={query.sortOrder === 'desc'}
              />
          </ToolbarGroup>
          <ToolbarGroup>
            <span>Цена от</span>
            <DropDownMenu value={query.minPrice} onChange={(e, i,value) =>this.minPrice(value)}>
              <MenuItem value={0} primaryText="~" />
              <MenuItem value={50} primaryText="50€" />
              <MenuItem value={100} primaryText="100€" />
              <MenuItem value={150} primaryText="150€" />
              <MenuItem value={200} primaryText="200€" />
              <MenuItem value={300} primaryText="300€" />
              <MenuItem value={500} primaryText="500€" />
            </DropDownMenu>
            <span>до</span>
            <DropDownMenu value={query.maxPrice} onChange={(e, i,value) => this.maxPrice(value)}>
              <MenuItem value={0} primaryText="~" />
              <MenuItem value={100} primaryText="100€" />
              <MenuItem value={150} primaryText="150€" />
              <MenuItem value={200} primaryText="200€" />
              <MenuItem value={300} primaryText="300€" />
              <MenuItem value={500} primaryText="500€" />
              <MenuItem value={1000} primaryText="1000€" />
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton onTouchTap={this.props.clearSearch}><IconClear/></IconButton>
          </ToolbarGroup>
      </Toolbar>
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
