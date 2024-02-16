import React from "react";

import GraphQLFetch from "./graphQLFetch";
import Toast from "./Toast.jsx";

export default class IssueDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {},
      toastVisible: false,
      toastMessage: "",
      toastType: "info",
    };
    this.showError = this.showError.bind(this);
    this.onDismissToast = this.onDismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const query = `query issue($id :Int!) {
            issue(id: $id){
                id description
            }
        }`;
    const data = await GraphQLFetch(query, { id },this.showError);
    if (data) {
      this.setState({ issue: data.issue });
    } else {
      this.setState({ issue: {} });
    }
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
    const {
      issue: { description },
    } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    return (
      <div>
        <h3>Description</h3>
        <pre>{description}</pre>
        <Toast
          onDismiss={this.onDismissToast}
          bsStyle={toastType}
          showing={toastVisible}
        >
          {toastMessage}
        </Toast>
      </div>
    );
  }
}
