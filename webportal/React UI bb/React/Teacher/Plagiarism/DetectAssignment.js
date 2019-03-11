'use strict';

import SubmittedList from './SubmittedList.js';

export default class DetectAssignment extends React.Component {
  // figure out if already submitted

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  onCancel(e) {
    this.props.goBack();
  }

  onSubmit(e) {
    // modal asking if sure, and then some database stuff
    this.setState({ showModal: true });
  }

  yesImSure(e) {
    // do some database stuff
    console.log("submit");
    this.props.goBack();
  }

  render() {
    let fakeModal = null;
    if (this.state.showModal) {
      fakeModal = React.createElement(
        'button',
        { onClick: e => this.yesImSure(e) },
        'Are you sure?'
      );
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'Package and Submit all Files for an Assignment'
      ),
      React.createElement(
        'p',
        null,
        'Assignment: ',
        this.props.assignment.name
      ),
      React.createElement(
        'button',
        { onClick: e => this.onSubmit(e) },
        'Submit'
      ),
      fakeModal,
      React.createElement(
        'button',
        { onClick: e => this.onCancel(e) },
        'Cancel'
      ),
      React.createElement(SubmittedList, { aid: this.props.assignment.id })
    );
  }
}