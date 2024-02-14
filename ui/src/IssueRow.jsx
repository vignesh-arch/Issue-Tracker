import React from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';

const IssueRow = withRouter(({ issue,location:{search},closeIssue,index })=>{
  const url = { pathname:`/issues/${issue.id}`, search};
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
        <button type="button" onClick = {()=>{closeIssue(index);}}>
          Close
        </button>
      </td>
    </tr>
  );
})

export default IssueRow;