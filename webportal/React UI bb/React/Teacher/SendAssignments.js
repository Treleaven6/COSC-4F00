'use strict';

export default class SendAssignments extends React.Component {
  // get list of files from server, along with corresponding student names

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'Send Assignments'
      ),
      React.createElement(
        'button',
        null,
        'Go'
      )
    );
  }
}