import React from "react";
import {
  ButtonToolbar,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  NavItem,
} from "react-bootstrap";
import { withRouter } from "react-router-dom";

import Toast from "./Toast.jsx";
import graphQLFetch from "./graphQLFetch.js";

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: "",
      toastType: "success",
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.onDismissToast = this.onDismissToast.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 3600 * 24 * 10 * 1000),
    };
    const query = `mutation addIssue($issue:IssueInputs!){
            addIssue(issue:$issue){
                id
            }
        }`;
    const data = await graphQLFetch(query, { issue }, this.showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.addIssue.id}`);
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
    const { showing, toastVisible, toastMessage, toastType } = this.state;

    return (
      <React.Fragment>
        <NavItem onClick={this.showModal}>
          <OverlayTrigger
            delay={1000}
            position="left"
            overlay={<Tooltip id="create_issue">Create Issue</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
        </NavItem>
        <Modal show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd" onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Owner</ControlLabel>
                <FormControl name="owner" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                onClick={this.handleSubmit}
                bsStyle="primary"
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>
                Cancel
              </Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
        <Toast
          showing={toastVisible}
          bsStyle={toastType}
          onDismiss={this.onDismissToast}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}

export default withRouter(IssueAddNavItem);
