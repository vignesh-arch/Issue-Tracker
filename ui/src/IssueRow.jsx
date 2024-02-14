import React from 'react';
import { Glyphicon,Button,Tooltip,OverlayTrigger } from 'react-bootstrap';
import { Link, withRouter, NavLink } from 'react-router-dom';

const IssueRow = withRouter(({ issue,location:{search},closeIssue,index,deleteIssue })=>{
  const url = { pathname:`/issues/${issue.id}`, search};
  const closeTooltip = (
    <Tooltip id="close-tooltip">Close Issue</Tooltip>
  );
  const deleteTooltip = (
    <Tooltip id="delete-tooltip">Delete Issue</Tooltip>
  );

  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.effort}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.due ? issue.due.toDateString() : ''}</td>
      <td>{issue.title}</td>
      <td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={url}>Select</NavLink>
        {' | '}
        <OverlayTrigger placement="top" delay={1000} overlay={closeTooltip}>
          <Button bsStyle="xsmall" type="button" onClick = {()=>{closeIssue(index);}}>
            <Glyphicon glyph="remove"/>
          </Button>
        </OverlayTrigger>
        {'  '}
       <OverlayTrigger placement="top" delay={1000} overlay={deleteTooltip}>
          <Button bsStyle="xsmall" type="button" onClick = {()=>{deleteIssue(index);}}>
            <Glyphicon glyph="trash"/>
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );
})

export default IssueRow;