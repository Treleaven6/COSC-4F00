"use strict";

export default class EnrollStudents extends React.Component {
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
          <h3>Enroll Students</h3>
          {"Name: "}
          <input type="text" />
          {"Something else: "}
          <input type="test" />
          <input type="submit" value="Enroll" />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
      </div>
    );
  }
}
