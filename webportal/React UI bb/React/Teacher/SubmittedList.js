'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class SubmittedList extends React.Component {
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
      const response = yield fetch("http://localhost:8081/api.php/" + (_this.state.isTeacher ? "teachingList" : "enrolledList") + "/" + _this.state.id);
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

  render() {
    let assList = null;
    if (typeof this.props.course["assignments"] !== "undefined") {
      assList = this.props.course["assignments"].map(assignment => React.createElement(
        "li",
        { key: assignment.id },
        React.createElement(
          "span",
          {
            onClick: () => this.props.onClick("assignment", assignment.course, assignment.id)
          },
          "name: " + assignment.name
        )
      ));
    }
    return React.createElement(
      "ul",
      null,
      assList
    );
  }
}