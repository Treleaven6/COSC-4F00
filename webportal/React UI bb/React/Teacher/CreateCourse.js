'use strict';

export default class CreateCourse extends React.Component {
  // subject code (MATH3P03, COSC4F00, etc)
  // year
  // semester

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      year: "",
      semester: ""
    };
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onCancel(e) {
    e.preventDefault();
    this.props.onCancel();
  }

  onCreate(e) {
    console.log("create course");
  }

  onSearch(e) {
    console.log("search");
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "form",
        null,
        "Code:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "code",
          value: this.state.code,
          onChange: e => this.handleInputChange(e)
        }),
        React.createElement("input", { type: "button", value: "Search", onClick: e => this.onSearch(e) }),
        "Year:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "year",
          value: this.state.year,
          onChange: e => this.handleInputChange(e)
        }),
        "Semester:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "semester",
          value: this.state.semester,
          onChange: e => this.handleInputChange(e)
        }),
        React.createElement("input", { type: "button", value: "Create", onClick: e => this.onCreate(e) }),
        React.createElement("input", { type: "button", value: "Cancel", onClick: e => this.onCancel(e) })
      )
    );
  }
}