"use strict";

import SingleStudentResult from "./SingleStudentResult.js";

// allow user to see results from a plagiarism report
export default class ResultsLanding extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      waitText: "waiting",
      seconds: 0,
      ready: false,
      results: null,
      showSingleStudent: false,
      studentKey: null
    };
    this.onClickStudent = this.onClickStudent.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  // update ellipses
  tick() {
    let tmp = this.state.waitText;
    if (tmp.endsWith("...")) {
      tmp = "waiting";
    } else {
      tmp = tmp + ".";
    }

    if (this.props.rid) {
      clearInterval(this.interval);
      this.setState({ waitText: "" });
      this.setState({
        ready: true
      });
    } else {
      this.setState({ waitText: tmp });
    }

    /*
    const path = "./api.php/reportready/" + this.props.rid;
    axios.get(path).then(res => {
      let ready = (res.data.length > 0);
      if (ready) {
        clearInterval(this.interval);
      }
      //console.log(ready);
    });
    */
  }

  // set up ellipses for waiting
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);

    // TESTING
    /*
    this.setState({
      waitText: "",
      results: {
        bs20js: { hj74kl: ["FlaggedFour1.cpp", "FlaggedFour2.cpp"] },
        ak34ot: { me93aw: ["Flagged1.java", "Flagged3.java"] },
        yj29dm: { xb29fq: ["FlaggedThree3.c", "FlaggedThree1.c"] }
      }
    });
    */
  }

  // stop waiting display
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // show info on that student
  onClickStudent(k) {
    this.setState({
      studentKey: k,
      showSingleStudent: true
    });
  }

  // stop showing a single student
  onBack() {
    this.setState({
      showSingleStudent: false
    });
  }

  // display
  render() {
    let studentList = null;
    if (this.state.ready) {
      let tmpArr = [];
      for (let key in this.props.testResults) {
        tmpArr.push(key);
      }
      studentList = tmpArr.map(k => React.createElement(
        "li",
        { key: k },
        React.createElement(
          "span",
          { onClick: () => this.onClickStudent(k) },
          k
        )
      ));
    }

    let singleStudent = null;
    if (this.state.showSingleStudent) {
      singleStudent = React.createElement(SingleStudentResult, { goBack: this.onBack, studentKey: this.state.studentKey, data: this.props.testResults[this.state.studentKey] });
    }

    return React.createElement(
      "div",
      null,
      this.state.waitText,
      React.createElement(
        "ul",
        null,
        studentList
      ),
      singleStudent
    );
  }
}