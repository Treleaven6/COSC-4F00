"use strict";

import SubmittedList from "./SubmittedList.js";
import ExcludedList from "./ExcludedList.js";

// Main parent for the plagiarism report request page

export default class DetectAssignment extends React.Component {
  // figure out if already submitted?

  // constructor
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

  // tell parent (Teacher) to go back
  onCancel(e) {
    this.props.goBack();
  }

  // toggle the confirmation button
  onSubmit(e) {}
  //this.setState({ showSubmitModal: !this.state.showSubmitModal });


  // yes request a plagiarism report, call the back end
  yesImSure(e) {
    const path = "./api.php/send/" + this.props.course.id + "/" + this.props.assignment.id;
    axios.post(path).then(res => {
      console.log(res);
    });
    this.props.goBack();
  }

  // update state with a file
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

  // pass a file to the back end, update frontend list
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

  // encode base64
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

  // update state with file selected
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

  // pass file to the backend
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

  // update state with file selected
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

  // pass zip to the backend
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

  // toggle confirmation button
  onDeleteExclude(e) {
    this.setState({
      showDeleteExcludeModal: !this.state.showDeleteExcludeModal
    });
  }

  // toggle confirmation button
  onDeleteInclude(e) {
    this.setState({
      showDeleteIncludeModal: !this.state.showDeleteIncludeModal
    });
  }

  // call backend to delete excluded files, update list
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

  // call backed to delete included files
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

  // display
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
        { style: { border: "1px solid black", margin: "2px" } },
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
        { style: { border: "1px solid black", margin: "2px" } },
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