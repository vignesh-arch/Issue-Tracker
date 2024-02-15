import React from 'react';
import PropTypes from 'prop-types';
import { 
  ControlLabel, Form, FormControl, 
  FormGroup, Button 
} from 'react-bootstrap';
/* globals React */

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 3600 * 24 * 10 * 1000),
    };
    const {createIssue} = this.props;
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return (
      <div>
        <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Owner:</ControlLabel>
            {' '}
            <FormControl type="text" name="owner" />
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Title:</ControlLabel>
            {' '}
            <FormControl type="text" name="title" />
          </FormGroup>
          {' '}
          <Button bsStyle="primary" type="submit">Add</Button>
        </Form>
      </div>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
}