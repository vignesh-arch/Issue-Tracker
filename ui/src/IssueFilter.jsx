import React from 'react';
import { withRouter } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import { Button } from 'react-bootstrap';

/* eslint React */
// eslint-disable-next-line react/prefer-stateless-function

class IssueFilter extends React.Component {
  constructor({location:{search}}){
    const params = new URLSearchParams(search);
    super();
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false,
    }
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onApplyFilter = this.onApplyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
  }

  componentDidUpdate(prevProps){
    const {location:{search:prevSearch}} = prevProps;
    const {location:{search}} = this.props;
    if(search!==prevSearch){
      this.showOriginalFilter();
    }
  }

  showOriginalFilter(){
    const {location:{search}} = this.props;
    const params = new URLSearchParams(search);
    this.setState(
      {
        status : params.get('status') || '',
        effortMin : params.get('effortMin') || '',
        effortMax : params.get('effortMax') || '',
        changed : false,
      }
    )
  }

  onChangeStatus = (e)=>{
    this.setState({
      status: e.target.value,
      changed: true,
    })
  }

  onApplyFilter = (e) => {
    const {status,effortMin,effortMax} = this.state;
    const {history} = this.props;
    const params = new URLSearchParams();
    if(status) params.set('status',status);
    if(effortMin) params.set('effortMin',effortMin);
    if(effortMax) params.set('effortMax',effortMax);

    const search = (params.toString()) ? `?${params.toString()}` : '' ;

    history.push(
      {
        pathname: '/issues',
        search,
      }
    )
  }

  onChangeEffortMin = (e) => {
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)){
      this.setState({
        effortMin: e.target.value,
        changed:true,
      })
    }
  }

  onChangeEffortMax = (e) => {
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)){
      this.setState({
        effortMax: e.target.value,
        changed:true,
      })
    }
  }

  render() {
    const {status,changed,effortMin,effortMax} = this.state;
    return (
        <div>
          Status:
          {' '}
          <select value={status} onChange={this.onChangeStatus}>
            <option value="">ALL</option>
            <option value="New">New Issues</option>
            <option value="Assigned">Assigned</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>
          {' '}
          Effort Between: 
          {' '}
          <input size={5} value={effortMin} onChange={this.onChangeEffortMin}/>
          {' - '}
          <input size={5} value={effortMax} onChange={this.onChangeEffortMax}/>
          {' '}
          <Button 
           type="button" 
           onClick={this.onApplyFilter}
           bsStyle="primary">
            Apply
          </Button>
          {' '}
          <Button
           type="button" 
           onClick={this.showOriginalFilter} 
           disabled={!changed}>
            Reset
          </Button>
        </div>
    );
  }
}

export default withRouter(IssueFilter);