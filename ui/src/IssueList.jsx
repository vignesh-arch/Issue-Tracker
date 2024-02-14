import React from 'react';
import URLSearchParams from 'url-search-params';
import { Route } from 'react-router-dom';

import IssueAdd from "./IssueAdd.jsx";
import IssueFilter from "./IssueFilter.jsx";
import IssueTable from "./IssueTable.jsx";
import GraphQLFetch from "./graphQLFetch.js";
import IssueDetail from './IssueDetail.jsx';

/* eslint React */

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
    };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch} } = prevProps;
    const { location: { search } } = this.props;
    if( prevSearch !== search ){
      this.loadData();
    }
  }

  async createIssue(issue) {
    const query = `mutation addIssue($issue:IssueInputs!){
            addIssue(issue:$issue){
                id
            }
        }`;
    const data = await GraphQLFetch(query, { issue });
    if (data) this.loadData();
  }

  async closeIssue(index){
    const query = `mutation issueUpdate($id:Int!){
      issueUpdate(id:$id,changes:{status:Closed}){
        id title created status
        owner effort due description
      }
    }`;
    const {issues} = this.state;
    const data = await GraphQLFetch(query,{id:issues[index].id});
    if(data){
      this.setState((prevState)=>{
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return {issues:newList};
      });
    }
    else{
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }} = this.props ;
    const params = new URLSearchParams(search);
    const vars = {};
    if(params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'),10);
    if(!Number.isNaN(effortMin)) vars.effortMin= effortMin;
    const effortMax = parseInt(params.get('effortMax'),10);
    if(!Number.isNaN(effortMax)) vars.effortMax= effortMax;
    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int){
        issueList(
          status: $status
          effortMin: $effortMin
          effortMax: $effortMax){
            id
            status
            owner
            effort
            created
            due
            title
            }
        }`;
    const data = await GraphQLFetch(query,vars);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  render() {
    const { issues } = this.state;
    const { match } = this.props;
    return (
      <>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues}  closeIssue={this.closeIssue}/>
        <hr />
        <IssueAdd createIssue={ this.createIssue } />
        <hr />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
      </>
    );
  }
}