"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class EnrolledList extends React.Component {
  componentDidUpdate() {
    if (!("enrolledList" in this.props.course)) {
      this.callEnrolledApi().then(res => {
        this.props.updateEnrolled(res);
        this.forceUpdate();
      }).catch(err => console.log(err));
    }
  }

  callEnrolledApi() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const response = yield fetch("./api.php/enrolled/" + _this.props.course.id);
      const body = yield response.json();
      if (response.status !== 200) throw Error(body.message);
      return body;
    })();
  }

  render() {
    let enrolledList = null;
    if ("enrolledList" in this.props.course) {
      enrolledList = this.props.course["enrolledList"].map(stud => React.createElement(
        "li",
        { key: stud.id },
        React.createElement(
          "span",
          null,
          "id: " + stud.id + ", firstname: " + stud.firstname + ", lastname: " + stud.lastname
        )
      ));
    }
    return React.createElement(
      "ul",
      null,
      enrolledList
    );
  }
}