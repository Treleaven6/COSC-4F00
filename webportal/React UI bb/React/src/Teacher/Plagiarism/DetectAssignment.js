'use strict';

import SubmittedList from './SubmittedList.js';

export default class DetectAssignment extends React.Component {
    // figure out if already submitted

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
      }

  onCancel(e) {
    this.props.goBack();
  }

  onSubmit(e) {
    // modal asking if sure, and then some database stuff
    this.setState({showModal: true});
  }

  yesImSure(e) {
      // do some database stuff
      console.log("submit");
      this.props.goBack();
  }

  render() {
      let fakeModal = null;
      if (this.state.showModal) {
          fakeModal = (<button onClick={e => this.yesImSure(e)}>Are you sure?</button>);
      }
    return (
      <div>
        <p>Package and Submit all Files for an Assignment</p>
        <p>Assignment: {this.props.assignment.name}</p>
        <button onClick={e => this.onSubmit(e)}>Submit</button>
        {fakeModal}
        <button onClick={e => this.onCancel(e)}>Cancel</button>
        <SubmittedList aid={this.props.assignment.id}/>
      </div>
    );
  }
}
