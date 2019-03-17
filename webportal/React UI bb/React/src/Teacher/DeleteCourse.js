"use strict";

export default class DeleteCourse extends React.Component {
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
          <h3>Are you Sure?</h3>
          <input type="submit" value="Yes, Delete" />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
      </div>
    );
  }
}
