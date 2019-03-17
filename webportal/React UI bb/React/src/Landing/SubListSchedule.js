"use strict";

// Called for each course, returns a list of assignments
export default class SubListSchedule extends React.Component {
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
