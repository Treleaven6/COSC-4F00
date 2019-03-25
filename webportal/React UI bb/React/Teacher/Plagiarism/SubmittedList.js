"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class SubmittedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gotFiles: false,
      files: null
    };
  }

  componentDidMount() {
    this.getUploaded().then(res => {
      this.setState({
        gotFiles: true,
        files: res
      });
    }).catch(err => console.log(err));
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

  getUploaded() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const response = yield fetch("./api.php/submitted/assignment/" + _this2.props.aid);
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = yield response.json();
      if (!Array.isArray(body)) throw Error("bad response: " + body);
      return body;
    })();
  }

  render() {
    let display_blurb = "0 people have submitted files";
    let display = "";
    let notSubmitted_blurb = "";
    let notSubmitted = null;

    if (this.state.gotFiles) {
      display_blurb = this.state.files.length + (this.state.files.length === 1 ? " person has submitted files" : " people have submitted files");
      display = this.state.files.map(f => React.createElement(
        "li",
        { key: f.id },
        "id: " + f.id + ", firstname: " + f.firstname + ", lastname: " + f.lastname + ", time: " + f.submit_time
      ));

      if ("enrolledList" in this.props.course) {
        let leftOut = [];
        let submitted;
        for (let i in this.props.course["enrolledList"]) {
          submitted = false;
          for (let j in this.state.files) {
            if (this.props.course["enrolledList"][i].id === this.state.files[j].id) {
              submitted = true;
              break;
            }
          }
          if (submitted === false) {
            leftOut.push(this.props.course["enrolledList"][i]);
          }
        }

        notSubmitted = leftOut.map(stud => React.createElement(
          "li",
          { key: stud.id },
          React.createElement(
            "span",
            null,
            "id: " + stud.id + ", firstname: " + stud.firstname + ", lastname: " + stud.lastname
          )
        ));

        notSubmitted_blurb = leftOut.length + (leftOut.length === 1 ? " person has yet to submit" : " people have yet to submit");
      }
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        display_blurb
      ),
      React.createElement(
        "ul",
        null,
        display
      ),
      React.createElement(
        "p",
        null,
        notSubmitted_blurb
      ),
      React.createElement(
        "ul",
        null,
        notSubmitted
      )
    );
  }
}