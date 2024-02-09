import React from 'react';

import IssueRow from "./IssueRow.jsx";

export default function IssueTable({ issues }) {
  return (
    <>
      <table className="bordered-table">
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
          {issues.map(issue => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </tbody>
      </table>
    </>
  );
}