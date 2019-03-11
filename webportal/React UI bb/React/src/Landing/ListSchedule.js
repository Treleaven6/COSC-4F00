'use strict';

import SubListSchedule from "./SubListSchedule.js";

// get courses and assignmnets
export default class ListSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.doNothing = this.doNothing.bind(this);
    // anti-pattern? just use props throughout?
    this.state = {
      id: this.props.id,
      isTeacher: this.props.isTeacher === "true",
      courses: ""
    };
  }

  componentDidMount() {
    this.callClassApi()
      .then(res => {
        if (Object.keys(res).length === 0) {
          // do nothing? display a little warning?
        } else {
          this.setState({
            courses: res
          });
          this.props.onCourses(res);
          this.classesDidMount();
        }
      })
      .catch(err => console.log(err));
  }

  classesDidMount() {
    for (let i = 0; i < this.state.courses.length; ++i) {
      let course = this.state.courses[i];
      this.callAssApi(course.id)
        .then(res => {
          let courses = this.state.courses;
          course["assignments"] = res;
          courses[i] = course;
          this.setState({
            courses: courses
          });
          this.props.onCourses(courses);
        })
        .catch(err => console.log(err));
    }
  }

  async callClassApi() {
    const response = await fetch(
      "http://localhost:8081/api.php/" +
        (this.state.isTeacher ? "teaching" : "enrolled") +
        "/" +
        this.state.id
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  async callAssApi(cid) {
    const response = await fetch("http://localhost:8081/api.php/assigned/" + cid);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  // when sublist (assignments) is disabled, this is their click action
  doNothing() { }

  render() {
    let courseList = null;
    if (this.state.courses !== "") {
      let clickAction = this.props.onClick;
      if (!this.props.sublist) {
        clickAction = this.doNothing;
      }

      courseList = this.state.courses.map(course => (
        <li key={course.id}>
          <span onClick={() => this.props.onClick("course", course.id, 0)}>
            {"code: " +
              course.code +
              ", " +
              "year: " +
              course.year +
              ", " +
              "semester: " +
              course.semester}
          </span>
          <SubListSchedule onClick={clickAction} course={course} />
        </li>
      ));
    }
    return <ul>{courseList}</ul>;
  }
}
