"use strict";

export default class EditCourseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

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
