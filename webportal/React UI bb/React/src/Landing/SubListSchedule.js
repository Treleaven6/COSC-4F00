import React, { Component } from "react";

export class SubListSchedule extends Component {
  render() {
    let assList = null;
    if (typeof this.props.course["assignments"] !== "undefined") {
      assList = this.props.course["assignments"].map(assignment => (
        <li key={assignment.id}>
          <span
            onClick={() =>
              this.props.onClick("assignment", assignment.course, assignment.id)
            }
          >
            {"name: " + assignment.name}
          </span>
        </li>
      ));
    }
    return <ul>{assList}</ul>;
  }
}
