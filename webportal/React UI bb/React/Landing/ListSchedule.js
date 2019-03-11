'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    this.callClassApi().then(res => {
      if (Object.keys(res).length === 0) {
        // do nothing? display a little warning?
      } else {
        this.setState({
          courses: res
        });
        this.props.onCourses(res);
        this.classesDidMount();
      }
    }).catch(err => console.log(err));
  }

  classesDidMount() {
    for (let i = 0; i < this.state.courses.length; ++i) {
      let course = this.state.courses[i];
      this.callAssApi(course.id).then(res => {
        let courses = this.state.courses;
        course["assignments"] = res;
        courses[i] = course;
        this.setState({
          courses: courses
        });
        this.props.onCourses(courses);
      }).catch(err => console.log(err));
    }
  }

  callClassApi() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const response = yield fetch("http://localhost:8081/api.php/" + (_this.state.isTeacher ? "teaching" : "enrolled") + "/" + _this.state.id);
      const body = yield response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    })();
  }

  callAssApi(cid) {
    return _asyncToGenerator(function* () {
      const response = yield fetch("http://localhost:8081/api.php/assigned/" + cid);
      const body = yield response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    })();
  }

  // when sublist (assignments) is disabled, this is their click action
  doNothing() {}

  render() {
    let courseList = null;
    if (this.state.courses !== "") {
      let clickAction = this.props.onClick;
      if (!this.props.sublist) {
        clickAction = this.doNothing;
      }

      courseList = this.state.courses.map(course => React.createElement(
        "li",
        { key: course.id },
        React.createElement(
          "span",
          { onClick: () => this.props.onClick("course", course.id, 0) },
          "code: " + course.code + ", " + "year: " + course.year + ", " + "semester: " + course.semester
        ),
        React.createElement(SubListSchedule, { onClick: clickAction, course: course })
      ));
    }
    return React.createElement(
      "ul",
      null,
      courseList
    );
  }
}