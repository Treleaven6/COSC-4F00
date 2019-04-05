"use strict";

// Allow user to recover their password

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      warning: ""
    };
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onRequest(e) {
    e.preventDefault();

    if (this.state.email === "") {
      return;
    }

    this.callApi(encodeURIComponent(this.state.email.trim())).then(res => {
      if (res.length === 0) {
        this.setState({
          warning: "email not found"
        });
      } else if (res.length > 1) {
        throw Error("Duplicate emails!");
      } else {
        this.setState({
          warning: "sent to admin"
        });
        // how to actually send to admin?
      }
    }).catch(err => console.log(err));
  }

  callApi(email) {
    return _asyncToGenerator(function* () {
      const response = yield fetch("./api.php/email/" + email);
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = yield response.json();
      if (!Array.isArray(body)) throw Error("bad response, check DB configuration");
      return body;
    })();
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "COMING SOON"
      ),
      React.createElement(
        "form",
        null,
        "Email:",
        " ",
        React.createElement("input", {
          type: "text",
          name: "email",
          value: this.state.email,
          onChange: e => this.updateEmail(e)
        }),
        React.createElement("input", {
          type: "submit",
          value: "Request",
          onClick: e => this.onRequest(e)
        }),
        React.createElement("input", { type: "button", value: "Back", onClick: e => this.onBack(e) })
      ),
      this.state.warning
    );
  }
}