"use strict";

export default class CreateAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.state = {
      datetime: "",
      name: ""
    };
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  onCreate(e) {
    e.preventDefault();
    let dt = this.state.datetime.trim();
    if (this.state.name === "") {
      console.log("have to specify a name");
      return;
    } else if (dt === "") {
      let path = "./api.php/newass/" + this.props.cid + "/" + encodeURIComponent(this.state.name) + "/";
      axios.post(path).then(res => {
        this.props.refreshList();
        this.props.goBack();
      });
    } else if (/\d\d\d\d-\d\d-\d\d \d\d:\d\d$/.test(dt)) {
      dt = dt + ":00";
      let path = "./api.php/newass/" + this.props.cid + "/" + encodeURIComponent(this.state.name) + "/" + encodeURIComponent(this.state.datetime);
      axios.post(path).then(res => {
        this.props.refreshList();
        this.props.goBack();
      });
    } else {
      console.log("could not parse datetime");
    }
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
          "Create Assignment"
        ),
        "Name: ",
        React.createElement("input", {
          type: "text",
          value: this.state.name,
          onChange: e => this.updateName(e)
        }),
        "Closing Date and Time: (must be in format YYYY-MM-DD hh:mm, 24 hour time)",
        React.createElement("input", {
          type: "text",
          value: this.state.datetime,
          onChange: e => this.updateDateTime(e)
        }),
        React.createElement("input", { type: "submit", value: "Create", onClick: e => this.onCreate(e) }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onBack(e) })
      )
    );
  }
}