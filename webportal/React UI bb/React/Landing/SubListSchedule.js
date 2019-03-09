'use strict';

export default class SubListSchedule extends React.Component {
  render() {
    let assList = null;
    if (typeof this.props.course["assignments"] !== "undefined") {
      assList = this.props.course["assignments"].map(assignment => React.createElement(
        "li",
        { key: assignment.id },
        React.createElement(
          "span",
          {
            onClick: () => this.props.onClick("assignment", assignment.course, assignment.id)
          },
          "name: " + assignment.name
        )
      ));
    }
    return React.createElement(
      "ul",
      null,
      assList
    );
  }
}