"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class SubmittedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      included: null
    };
  }

  componentDidMount() {
    this.getCluded().then(res => {
      this.setState({
        included: res
      });
    }).catch(err => console.log(err));
  }

  getCluded() {
    var _this = this;

    return _asyncToGenerator(function* () {
      //console.log("get cluded");
      const response = yield fetch("./api.php/included/" + _this.props.cid + "/" + _this.props.aid);
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = yield response.json();
      return body;
    })();
  }

  render() {
    let included_blurb = "No files to include";
    let included = this.state.included;
    let jsx = "";
    if (included) {
      if (this.props.deleteAll) {
        included.length = 0;
      } else if (this.props.addFile) {
        if (!included.includes(this.props.addFile)) {
          included.push(this.props.addFile);
        }
      }
      included_blurb = included.length + " included files";
      jsx = included.map(n => React.createElement(
        "li",
        { key: n },
        n
      ));
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        included_blurb
      ),
      React.createElement(
        "ul",
        null,
        jsx
      )
    );
  }
}