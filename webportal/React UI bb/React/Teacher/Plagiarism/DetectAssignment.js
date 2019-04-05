"use strict";

import SubmittedList from "./SubmittedList.js";
import ExcludedList from "./ExcludedList.js";
import IncludedList from "./IncludedList.js";

export default class DetectAssignment extends React.Component {
  // figure out if already submitted

  constructor(props) {
    super(props);
    this.state = {
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false,
      includeFile: null,
      includeZipFile: null,
      excludeFile: null,
      addExcluded: null,
      addIncluded: null,
      addIncludedZip: null,
      deleteAllExcluded: false,
      deleteAllIncluded: false
    };
  }

  onCancel(e) {
    this.props.goBack();
  }

  onSubmit(e) {
    // modal asking if sure, and then some database stuff
    this.setState({ showSubmitModal: !this.state.showSubmitModal });
  }

  yesImSure(e) {
    // do some database stuff
    const path = "./api.php/send/" + this.props.course.id + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      console.log(res);
    });
    this.props.goBack();
  }

  handleExcludeSelected(event) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    let file = event.target.files[0];
    if (file) {
      this.setState({
        excludeFile: file

      });
    } else {
      console.log("no file");
    }
  }

  onExclude(e) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    if (this.state.excludeFile === null) {
      console.log("no file specified");
      return;
    }
    const path = "./api.php/exclude/" + this.props.course.id + "/" + this.props.assignment.id + "/" + this.state.excludeFile.name;
    this.getBase64(this.state.excludeFile, result => {
      axios.post(path, encodeURIComponent(result)).then(res => {
        this.setState({
          addExcluded: this.state.excludeFile.name,
          deleteAllExcluded: false
        });
        console.log(res.data);
      });
    });
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  handleIncludeSelected(event) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    let file = event.target.files[0];
    if (file) {
      this.setState({
        includeFile: file
      });
    } else {
      console.log("no file");
    }
  }

  onInclude(e) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    if (this.state.includeFile === null) {
      console.log("no file specified");
      return;
    }
    const path = "./api.php/include/" + this.props.course.id + "/" + this.props.assignment.id + "/" + this.state.includeFile.name;
    this.getBase64(this.state.includeFile, result => {
      axios.post(path, encodeURIComponent(result)).then(res => {
        /*
        this.setState({
          addIncluded: this.state.includeFile.name,
          deleteAllIncluded: false
        });
        */
        console.log(res.data);
      });
    });
  }

  handleIncludeZipSelected(event) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    let file = event.target.files[0];
    if (file) {
      this.setState({
        includeZipFile: file
      });
    } else {
      console.log("no file");
    }
  }

  onIncludeZip(e) {
    this.setState({
      showSubmitModal: false,
      showDeleteExcludeModal: false,
      showDeleteIncludeModal: false
    });
    if (this.state.includeZipFile === null) {
      console.log("no file specified");
      return;
    }
    const path = "./api.php/includezip/" + this.props.course.id + "/" + this.props.assignment.id + "/" + this.state.includeZipFile.name;
    this.getBase64(this.state.includeZipFile, result => {
      axios.post(path, encodeURIComponent(result)).then(res => {
        console.log(res.data);
      });
    });
  }

  onDeleteExclude(e) {
    this.setState({
      showDeleteExcludeModal: !this.state.showDeleteExcludeModal
    });
  }

  onDeleteInclude(e) {
    this.setState({
      showDeleteIncludeModal: !this.state.showDeleteIncludeModal
    });
  }

  reallyDeleteExclude(e) {
    const path = "./api.php/rmexclude/" + this.props.course.id + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      console.log(res.data);
      this.setState({
        showDeleteExcludeModal: false,
        deleteAllExcluded: true
      });
    });
  }

  reallyDeleteInclude(e) {
    const path = "./api.php/rminclude/" + this.props.course.id + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      console.log(res.data);
      this.setState({
        showDeleteIncludeModal: false,
        deleteAllIncluded: true
      });
    });
  }

  render() {
    let submitModal = null;
    if (this.state.showSubmitModal) {
      submitModal = React.createElement(
        "button",
        { onClick: e => this.yesImSure(e) },
        "Are you sure?"
      );
    }

    let deleteExcludeModal = null;
    if (this.state.showDeleteExcludeModal) {
      deleteExcludeModal = React.createElement(
        "button",
        { onClick: e => this.reallyDeleteExclude(e) },
        "Are you sure?"
      );
    }

    let deleteIncludeModal = null;
    if (this.state.showDeleteIncludeModal) {
      deleteIncludeModal = React.createElement(
        "button",
        { onClick: e => this.reallyDeleteInclude(e) },
        "Are you sure?"
      );
    }

    /*
    <IncludedList
            cid={this.props.course.id}
            aid={this.props.assignment.id}
            addFile={this.state.addIncluded}
            deleteAll={this.state.deleteAllIncluded}
          />
    */

    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "Package and Submit all Files for an Assignment"
      ),
      React.createElement(
        "p",
        null,
        "Assignment: ",
        this.props.assignment.name
      ),
      React.createElement(
        "button",
        { onClick: e => this.onSubmit(e) },
        "Submit"
      ),
      submitModal,
      React.createElement(
        "button",
        { onClick: e => this.onCancel(e) },
        "Cancel"
      ),
      React.createElement(
        "div",
        { style: { border: '1px solid black' } },
        React.createElement(
          "p",
          null,
          "Exclude"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onDeleteExclude(e) },
          "Delete All Old files"
        ),
        deleteExcludeModal,
        React.createElement("input", {
          type: "file",
          onChange: e => this.handleExcludeSelected(e),
          accept: ".txt,.rtf,.java,.cpp,.c,.hpp,.h"
        }),
        React.createElement(
          "button",
          { onClick: e => this.onExclude(e) },
          "Upload"
        ),
        React.createElement(ExcludedList, {
          cid: this.props.course.id,
          aid: this.props.assignment.id,
          addFile: this.state.addExcluded,
          deleteAll: this.state.deleteAllExcluded
        })
      ),
      React.createElement(
        "div",
        { style: { border: '1px solid black' } },
        React.createElement(
          "p",
          null,
          "Include"
        ),
        React.createElement(
          "button",
          { onClick: e => this.onDeleteInclude(e) },
          "Delete All Old"
        ),
        deleteIncludeModal,
        React.createElement(
          "p",
          null,
          "Include an exported assignment"
        ),
        React.createElement("input", {
          type: "file",
          onChange: e => this.handleIncludeZipSelected(e),
          accept: ".zip"
        }),
        React.createElement(
          "button",
          { onClick: e => this.onIncludeZip(e) },
          "Upload"
        ),
        React.createElement(
          "p",
          null,
          "Include a file"
        ),
        React.createElement("input", {
          type: "file",
          onChange: e => this.handleIncludeSelected(e),
          accept: ".txt,.rtf,.java,.cpp,.c,.hpp,.h"
        }),
        React.createElement(
          "button",
          { onClick: e => this.onInclude(e) },
          "Upload"
        )
      ),
      React.createElement(SubmittedList, {
        cid: this.props.course.id,
        aid: this.props.assignment.id,
        course: this.props.course,
        updateEnrolled: this.props.updateEnrolled
      })
    );
  }
}