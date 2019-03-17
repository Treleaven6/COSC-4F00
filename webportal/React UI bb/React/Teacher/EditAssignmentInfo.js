"use strict";

export default class EditAssignmentInfo extends React.Component {
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

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  updateName(e) {
    this.setState({
      name: e.target.value
    });
  }

  updateDateTime(e) {
    this.setState({
      datetime: e.target.value
    });
  }

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
        this.props.goBack();
      });
    } else if (/\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/.test(dt)) {
      let path = "./api.php/upass/" + this.props.id + "/" + encodeURIComponent(this.state.name) + "/" + encodeURIComponent(dt);
      axios.post(path).then(res => {
        this.props.updateParent(this.state.name, dt);
        this.props.goBack();
      });
    } else {
      console.log("could not parse datetime");
    }
  }

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