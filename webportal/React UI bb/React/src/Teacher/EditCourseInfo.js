"use strict";

// Allow a teacher to edit course information
// Currently non-functional

export default class EditCourseInfo extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  // tell parent (Course) to go back
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // display
  render() {
    return (
      <div>
        <form>
          <h3>Edit Info</h3>
          {"Description: "}
          <input type="text" />
          <input type="submit" value="Update" />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
      </div>
    );
  }
}
