"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class Course extends React.Component {
  callPersonApi() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const response = yield fetch("./api.php/person/" + _this.props.course.instructor);
      const body = yield response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    })();
  }

  render() {
    if (typeof this.props.course["firstname"] === "undefined" && typeof this.props.course["lastname"] === "undefined") {
      this.callPersonApi().then(res => {
        let course = this.props.course;
        course["firstname"] = res[0].firstname;
        course["lastname"] = res[0].lastname;
        this.props.onInstructor(course);
      }).catch(err => console.log(err));
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "a Course"
      ),
      React.createElement(
        "p",
        null,
        "id: ",
        this.props.course.id
      ),
      React.createElement(
        "p",
        null,
        "code: ",
        this.props.course.code
      ),
      React.createElement(
        "p",
        null,
        "name: ",
        this.props.course.name
      ),
      React.createElement(
        "p",
        null,
        "instructor: ",
        this.props.course.firstname,
        " ",
        this.props.course.lastname
      ),
      React.createElement(
        "p",
        null,
        "description: ",
        this.props.course.description
      ),
      React.createElement(
        "p",
        null,
        "year: ",
        this.props.course.year
      ),
      React.createElement(
        "p",
        null,
        "semester: ",
        this.props.course.semester
      )
    );
  }
}