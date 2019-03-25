"use strict";

export default class EnrolledList extends React.Component {
  componentDidUpdate() {
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

  render() {
    let enrolledList = null;
    if ("enrolledList" in this.props.course) {
      enrolledList = this.props.course["enrolledList"].map(stud => (
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
    }
    return <ul>{enrolledList}</ul>;
  }
}
