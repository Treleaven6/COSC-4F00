"use strict";

// Allow a teacher to create a new assignment in a course

export default class CreateAssignment extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      datetime: "",
      name: ""
    };
  }

  // tell parent (Course) to go back
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // call the backend
  onCreate(e) {
    e.preventDefault();
    let dt = this.state.datetime.trim();
    if (this.state.name === "") {
      console.log("have to specify a name");
      return;
    } else if (dt === "") {
      let path =
        "./api.php/newass/" +
        this.props.cid +
        "/" +
        encodeURIComponent(this.state.name) +
        "/";
      axios.post(path).then(res => {
        this.props.refreshList();
        this.props.goBack();
      });
    } else if (/\d\d\d\d-\d\d-\d\d \d\d:\d\d$/.test(dt)) {
      dt = dt + ":00";
      let path =
        "./api.php/newass/" +
        this.props.cid +
        "/" +
        encodeURIComponent(this.state.name) +
        "/" +
        encodeURIComponent(this.state.datetime);
      axios.post(path).then(res => {
        this.props.refreshList();
        this.props.goBack();
      });
    } else {
      console.log("could not parse datetime");
    }
  }

  // this is how React does input fields
  updateName(e) {
    this.setState({
      name: e.target.value
    });
  }

  // this is how React does input fields
  updateDateTime(e) {
    this.setState({
      datetime: e.target.value
    });
  }

  // display
  render() {
    return (
      <div>
        <form>
          <h3>Create Assignment</h3>
          {"Name: "}
          <input
            type="text"
            value={this.state.name}
            onChange={e => this.updateName(e)}
          />
          {
            "Closing Date and Time: (must be in format YYYY-MM-DD hh:mm, 24 hour time)"
          }
          <input
            type="text"
            value={this.state.datetime}
            onChange={e => this.updateDateTime(e)}
          />
          <input type="submit" value="Create" onClick={e => this.onCreate(e)} />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
      </div>
    );
  }
}
