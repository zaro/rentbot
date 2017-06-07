import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import {search} from './api';
import {newSearch, searchResultsAvailable} from './actions'
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';

class SearchBarComponent extends React.Component {
  state = {
    dataSource: [],
    query: '',
    sortBy: 'price_euro',
    sortOrder: 'asc',
  }

  query = (query) => {
    this.props.search(query, this.state.sortBy, this.state.sortOrder);
    this.setState({query});
  }

  sortOrder = (sortOrder) => {
    this.props.search(this.state.query, this.state.sortBy, sortOrder);
    this.setState({sortOrder});
  }

  sortBy = (sortBy) => {
    this.props.search(this.state.query, sortBy, this.state.sortOrder);
    this.setState({sortBy});
  }

  render(){
    return (
      <div>
        <AutoComplete
          hintText="Търси в обяви"
          dataSource={this.state.dataSource}
          fullWidth={true}
          onNewRequest={(q) => this.query(q)}
        />
        <RadioButtonGroup style={styles.radioGroup} name="sortBy" defaultSelected={this.state.sortBy} onChange={(e, value) => {console.log('onChange');this.sortBy(value)}}>
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
        <div style={{ display: 'inline-block', width: '150px' }} >
          <Checkbox
            onCheck={(e, isChecked) => {console.log('onChange');this.sortOrder(isChecked ? 'desc': 'asc')}}
            checkedIcon={<ArrowUpward />}
            uncheckedIcon={<ArrowDownward />}
            label="Сортиране"
            checked={this.state.sortOrder === 'desc'}
          />
        </div>
      </div>
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
    search: (q, sortBy, sortOrder) => {
      dispatch(newSearch({q, sortBy, sortOrder}));
      search(q, sortBy, sortOrder).then((results) => dispatch(searchResultsAvailable(results.hitSources, results.total)))
    }
  }
}

const SearchBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBarComponent)


export default SearchBar;
