import React from 'react';
import { Table } from 'react-bootstrap';

import IssueRow from './IssueRow.jsx';

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  return (
    <>
      <Table bordered condensed hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Effort</th>
            <th>Created</th>
            <th>Due Date</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              index={index}
              closeIssue={closeIssue}
              deleteIssue={deleteIssue}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
}
