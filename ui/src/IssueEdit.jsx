import React from "react";

export default function IssueEdit({ match }) {
    const { id } = match.params;
    return (
        <div>
            <h2> {`This is the placeholder for editing issue ${id}`} </h2>
        </div>
    );

}