import React from "react";
import URLSearchParams from "url-search-params";
import { Route } from "react-router-dom";
import { Panel } from "react-bootstrap";

import IssueFilter from "./IssueFilter.jsx";
import IssueTable from "./IssueTable.jsx";
import graphQLFetch from "./graphQLFetch.js";
import IssueDetail from "./IssueDetail.jsx";
import Toast from "./Toast.jsx";
import store from "./store.js";

/* eslint React */

export default class IssueList extends React.Component {
  static async fetchData (match,search,showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get("status")) vars.status = params.get("status");
    const effortMin = parseInt(params.get("effortMin"), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get("effortMax"), 10);
    if ( !Number.isNaN( effortMax ) ) vars.effortMax = effortMax;
    const { params: { id } } = match;
    const idInt = parseInt(id);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }
    const query = `query issueList(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!){
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
        issue(id: $selectedId) @include (if: $hasSelection){
          id description
        }
      }`;
    const data = await graphQLFetch( query, vars, showError );
    return data;
  }
  constructor() {
    super();
    const issues = store.initialData ? store.initialData.issueList : null;
    const selectedIssue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issues,
      selectedIssue,
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
    };
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.onDismissToast = this.onDismissToast.bind(this);
  }

  componentDidMount() {
    const { issues } = this.state;
    if ( issues == null ) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch },
      match: { params: {id:prevId} } } = prevProps;
    const { location: { search },
      match: { params: { id } } } = this.props;
    if ( prevSearch !== search || prevId !== id ) {
      this.loadData();
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
    const data = await graphQLFetch(query, { id: issues[index].id },this.showError);
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
    const data = await graphQLFetch(query, { id });
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

  async loadData () {
    const { location: { search }, match } = this.props;
    const data = await IssueList.fetchData( match, search, this.showError );
    if (data) {
      this.setState({ issues: data.issueList, selectedIssue: data.issue });
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

  onDismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { issues } = this.state;
    if ( issues == null ) return null;

    const { location: { search }, match, } = this.props;
    const hasFilter = search !== "";
    const { toastVisible, toastMessage, toastType } = this.state;
    const { selectedIssue } = this.state;
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
        <IssueDetail issue={selectedIssue} />
        <Toast
          onDismiss={this.onDismissToast}
          bsStyle={toastType}
          showing={toastVisible}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}
