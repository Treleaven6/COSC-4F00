import React, { Component } from "react";
import { SubListSchedule } from "./SubListSchedule";

// get courses and assignmnets
export class ListSchedule extends Component {
  constructor(props) {
    super(props);
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

  callClassApi = async () => {
    const response = await fetch(
      "/" +
        (this.state.isTeacher ? "teachingList" : "enrolledList") +
        "/" +
        this.state.id
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  callAssApi = async cid => {
    const response = await fetch("/assigned/" + cid);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    let courseList = null;
    if (this.state.courses !== "") {
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
          <SubListSchedule onClick={this.props.onClick} course={course} />
        </li>
      ));
    }
    return <ul>{courseList}</ul>;
  }
}
