"use strict";

// display results for a single student
// currently a stub

export default class SingleStudentResult extends React.Component {
  // constructor
  constructor(props) {
    super(props);
  }

  // display
  render() {

    //let fake = JSON.parse('{"HeapSort.java":{"[EKLNG4c1a1]_MergeSort.java":{"grade":"5.33%","lines":["[ 0]: [82-91] [99-108]","[ 1]: [81-91] [98-108]","[ 2]: [81-89] [98-106]","[ 3]: [82-91] [99-108]"]}}}');

    let tmpArr = [];
    let tag = "";
    for (let k1 in this.props.data) {
      for (let k2 in this.props.data[k1]) {
        tag = "local: " + k1 + ", remote: " + k2 + ", plagiarised: " + this.props.data[k1][k2]["grade"];
      }
      tmpArr.push(tag);
    }
    let bullets = tmpArr.map(k => React.createElement(
      "li",
      { key: k },
      k
    ));

    // <p>{JSON.stringify(this.props.data)}</p>

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "Showing data for " + this.props.studentKey
      ),
      React.createElement(
        "button",
        { onClick: e => this.props.goBack() },
        "Hide"
      ),
      React.createElement(
        "ul",
        null,
        bullets
      )
    );
  }
}