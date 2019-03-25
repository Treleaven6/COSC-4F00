"use strict";

export default class SubmittedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotFiles: false,
      files: null
    };
  }

  componentDidMount() {
    this.getUploaded()
      .then(res => {
        this.setState({
          gotFiles: true,
          files: res
        });
      })
      .catch(err => console.log(err));
    if (!("enrolledList" in this.props.course)) {
      this.callEnrolledApi()
        .then(res => {
          this.props.updateEnrolled(res);
          this.forceUpdate();
        })
        .catch(err => console.log(err));
    }
  }

  async callEnrolledApi() {
    const response = await fetch("./api.php/enrolled/" + this.props.course.id);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  async getUploaded() {
    const response = await fetch(
      "./api.php/submitted/assignment/" + this.props.aid
    );
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    if (!Array.isArray(body)) throw Error("bad response: " + body);
    return body;
  }

  render() {
    let display_blurb = "0 people have submitted files";
    let display = "";
    let notSubmitted_blurb = "";
    let notSubmitted = null;

    if (this.state.gotFiles) {
      display_blurb =
        this.state.files.length +
        (this.state.files.length === 1
          ? " person has submitted files"
          : " people have submitted files");
      display = this.state.files.map(f => (
        <li key={f.id}>
          {"id: " +
            f.id +
            ", firstname: " +
            f.firstname +
            ", lastname: " +
            f.lastname +
            ", time: " +
            f.submit_time}
        </li>
      ));

      if ("enrolledList" in this.props.course) {
        let leftOut = [];
        let submitted;
        for (let i in this.props.course["enrolledList"]) {
          submitted = false;
          for (let j in this.state.files) {
            if (
              this.props.course["enrolledList"][i].id === this.state.files[j].id
            ) {
              submitted = true;
              break;
            }
          }
          if (submitted === false) {
            leftOut.push(this.props.course["enrolledList"][i]);
          }
        }

        notSubmitted = leftOut.map(stud => (
          <li key={stud.id}>
            <span>
              {"id: " +
                stud.id +
                ", firstname: " +
                stud.firstname +
                ", lastname: " +
                stud.lastname}
            </span>
          </li>
        ));

        notSubmitted_blurb =
          leftOut.length +
          (leftOut.length === 1
            ? " person has yet to submit"
            : " people have yet to submit");
      }
    }

    return (
      <div>
        <p>{display_blurb}</p>
        <ul>{display}</ul>
        <p>{notSubmitted_blurb}</p>
        <ul>{notSubmitted}</ul>
      </div>
    );
  }
}
