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
      [event.target.name]: event.target.value,
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
    return (
      <div>
        <form>
          Code:{" "}
          <input
            type="text"
            name="code"
            value={this.state.code}
            onChange={e => this.handleInputChange(e)}
          />
          <input type="button" value="Search" onClick={e => this.onSearch(e)} />
          Year:{" "}
          <input
            type="text"
            name="year"
            value={this.state.year}
            onChange={e => this.handleInputChange(e)}
          />
          Semester:{" "}
          <input
            type="text"
            name="semester"
            value={this.state.semester}
            onChange={e => this.handleInputChange(e)}
          />
          <input type="button" value="Create" onClick={e => this.onCreate(e)} />
          <input type="button" value="Cancel" onClick={e => this.onCancel(e)}/>
        </form>
      </div>
    );
  }
}
