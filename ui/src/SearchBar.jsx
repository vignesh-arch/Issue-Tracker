import React from 'react';
import SelectAsync from 'react-select/lib/Async.js';
import { withRouter } from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChangeSelection = this.onChangeSelection.bind(this);
  }

  async loadOptions(term) {
    const { showError } = this.props;

    if (term.length < 3) return [];
    const query = `query issueList($search: String){
            issueList(search: $search){
                issues{title id}
            }
        }`;
    const result = await graphQLFetch(query, { search: term }, showError);
    return result.issueList.issues.map((issue) => {
      return { label: `#${issue.id} ${issue.title}`, value: issue.id };
    });
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    history.push({
      pathname: `/edit/${value}`,
    });
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(SearchBar);
