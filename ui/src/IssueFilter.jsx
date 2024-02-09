import React from 'react';
import { withRouter } from 'react-router-dom';

/* eslint React */
// eslint-disable-next-line react/prefer-stateless-function

class IssueFilter extends React.Component {
  constructor(){
    super();
    this.onChangeStatus = this.onChangeStatus.bind(this);
  }

  onChangeStatus = (e)=>{
    const status= e.target.value;
    const { history }= this.props;
    history.push({
      pathname: '/issues',
      search: status ? `?status=${status}` : '',
    });
  }

  render() {
    return (
        <div>
          Status:
          {' '}
          <select onChange={this.onChangeStatus}>
            <option value="">ALL</option>
            <option value="New">New Issues</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
    );
  }
}

export default withRouter(IssueFilter);