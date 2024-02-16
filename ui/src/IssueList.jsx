import React from "react";
import URLSearchParams from "url-search-params";
import { Route } from "react-router-dom";
import { Panel } from "react-bootstrap";

import IssueAdd from "./IssueAdd.jsx";
import IssueFilter from "./IssueFilter.jsx";
import IssueTable from "./IssueTable.jsx";
import GraphQLFetch from "./graphQLFetch.js";
import IssueDetail from "./IssueDetail.jsx";
import Toast from "./Toast.jsx";

/* eslint React */

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: [],
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
    };
    this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async createIssue(issue) {
    const query = `mutation addIssue($issue:IssueInputs!){
            addIssue(issue:$issue){
                id
            }
        }`;
    const data = await GraphQLFetch(query, { issue },this.showError);
    if (data){ 
      this.loadData();
      this.showSuccess('Issue Added Successfully.');
    }
  }

  async closeIssue(index) {
    const query = `mutation issueUpdate($id:Int!){
      issueUpdate(id:$id,changes:{status:Closed}){
        id title created status
        owner effort due description
      }
    }`;
    const { issues } = this.state;
    const data = await GraphQLFetch(query, { id: issues[index].id },this.showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return { issues: newList };
      });
      this.showSuccess('Issue Closed.')
    } else {
      this.loadData();
    }
  }

  async deleteIssue(index) {
    const query = `mutation issueDelete($id:Int!){
      issueDelete(id: $id)
    }`;
    const {
      location: { pathname, search },
      history,
    } = this.props;
    const { issues } = this.state;
    const { id } = issues[index];
    const data = await GraphQLFetch(query, { id });
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({
            pathname: "/issues",
            search,
          });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
      this.showSuccess('Issue Deleted Successfully');
    } else {
      this.loadData();
    }
  }

  async loadData() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get("status")) vars.status = params.get("status");
    const effortMin = parseInt(params.get("effortMin"), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get("effortMax"), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
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
    const data = await GraphQLFetch(query, vars,this.showError);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: "success",
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true,
      toastMessage: message,
      toastType: "danger",
    });
  }

  onDismiss() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { issues } = this.state;
    const {
      location: { search },
      match,
    } = this.props;
    const hasFilter = search !== "";
    const { toastVisible, toastMessage, toastType } = this.state;

    return (
      <React.Fragment>
        <Panel defaultExpanded={hasFilter}>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <IssueFilter />
          </Panel.Body>
        </Panel>
        <IssueTable
          issues={issues}
          closeIssue={this.closeIssue}
          deleteIssue={this.deleteIssue}
        />
        <IssueAdd createIssue={this.createIssue} />
        <Route path={`${match.path}/:id`} component={IssueDetail} />
        <Toast
          onDismiss={this.onDismiss}
          bsStyle={toastType}
          showing={toastVisible}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}
