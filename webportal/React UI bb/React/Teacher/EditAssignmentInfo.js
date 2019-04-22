"use strict";

// Allow a teacher to edit an assignment name and due date

export default class EditAssignmentInfo extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    let dt = this.props.closing;
    dt = dt === null ? "" : dt;
    this.state = {
      datetime: dt,
      name: this.props.name
    };
  }

  // tell parent (Assignment) to go back
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // this is how React handles input fields
  updateName(e) {
    this.setState({
      name: e.target.value
    });
  }

  // this is how React handles input fields
  updateDateTime(e) {
    this.setState({
      datetime: e.target.value
    });
  }

  // call the backend to update the record
  handleUpdate(e) {
    e.preventDefault();
    let dt = this.state.datetime.trim();
    if (this.state.name === "") {
      console.log("have to specify a name");
      return;
    } else if (dt === "") {
      let path = "./api.php/upass/" + this.props.id + "/" + encodeURIComponent(this.state.name) + "/";
      axios.post(path).then(res => {
        this.props.updateParent(this.state.name, "");
        this.props.refreshList();
        this.props.goBack();
      });
    } else if (/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/.test(dt)) {
      let path = "./api.php/upass/" + this.props.id + "/" + encodeURIComponent(this.state.name) + "/" + encodeURIComponent(dt);
      axios.post(path).then(res => {
        this.props.updateParent(this.state.name, dt);
        this.props.refreshList();
        this.props.goBack();
      });
    } else {
      console.log("could not parse datetime");
    }
  }

  // display
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        null,
        React.createElement(
          "h3",
          null,
          "Edit Info"
        ),
        "Name: ",
        React.createElement("input", {
          type: "text",
          value: this.state.name,
          onChange: e => this.updateName(e)
        }),
        "Closing Date and Time: (must be in format YYYY-MM-DD hh:mm:ss, 24 hour time)",
        React.createElement("input", {
          type: "text",
          value: this.state.datetime,
          onChange: e => this.updateDateTime(e)
        }),
        React.createElement("input", {
          type: "submit",
          value: "Update",
          onClick: e => this.handleUpdate(e)
        }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}