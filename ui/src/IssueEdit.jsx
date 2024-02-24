import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Panel,
  Form,
  ControlLabel,
  FormControl,
  FormGroup,
  Col,
  ButtonToolbar,
  Button,
  Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import store from './store.js';
import withToast from './withToast.jsx';
import UserContext from './UserContext.js';

class IssueEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query issue($id: Int!){
            issue(id: $id){
                id title status owner
                effort created due description
            }
        }`;
    const {
      params: { id },
    } = match;
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.onDismissValidation = this.onDismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const { issue } = this.state;
    if (issue == null) {
      this.loadData();
    }
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
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(e, naturalValue) {
    const { name, value: textValue } = e.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState( prevState => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  onValidityChange(e, valid) {
    const { name } = e.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFiels, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);
    this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  onDismissValidation() {
    this.setState({ showingValidation: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation issueUpdate(
            $id:Int!
            $changes:IssueUpdateInputs!){
                issueUpdate(
                    id:$id
                    changes:$changes){
                        id title created status
                        owner effort due description                       
                    }
            }`;
    const { id, created, ...changes } = issue;
    const { showError, showSuccess } = this.props;
    const data = await graphQLFetch(query, { id, changes }, showError);
    if (data) {
      this.setState({ issue: data.issueUpdate });
      showSuccess('Issue Updated Successfully.');
    }
  }

  render() {
    const { issue } = this.state;
    if (issue == null) {
      return null;
    }

    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Requested Id:${propsId} not Found`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.onDismissValidation}>
          Please Correct Invalid Fields before Submitting
        </Alert>
      );
    }

    const {
      issue: { title, status },
    } = this.state;
    const {
      issue: { description, effort, owner },
    } = this.state;
    const {
      issue: { due, created },
    } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing Issue : ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Created
              </Col>
              <Col sm={9}>
                <FormControl.Static>
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Status
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="status"
                  value={status}
                  onChange={this.onChange}
                >
                  <option value="All">(All)</option>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Owner
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="owner"
                  value={owner}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Effort
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="effort"
                  value={effort}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup validationState={invalidFields.due ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Due
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  name="due"
                  value={due}
                  onChange={this.onChange}
                  onValidityChange={this.onValidityChange}
                  key={id}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Title
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  tag="textarea"
                  rows={8}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button disabled={!user.signedIn} bsStyle="primary" type="submit">
                    Submit
                  </Button>
                  <LinkContainer to="/issues">
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>
                {validationMessage}
              </Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Panel.Footer>
          <Link to={`/edit/${id - 1}`}>Prev</Link>
          {' | '}
          <Link to={`/edit/${id + 1}`}>Next</Link>
        </Panel.Footer>
      </Panel>
    );
  }
}

IssueEdit.contextType = UserContext;

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
export default IssueEditWithToast;
