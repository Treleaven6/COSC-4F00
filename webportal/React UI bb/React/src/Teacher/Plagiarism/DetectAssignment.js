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
      excludeFile: null,
      addExcluded: null,
      addIncluded: null,
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
    const path =
      "./api.php/send/" + this.props.course.id + "/" + this.props.assignment.id;
    axios.post(path);
    this.props.goBack();
  }

  handleExcludeSelected(event) {
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
    if (this.state.excludeFile === null) {
      return;
    }
    const path =
      "./api.php/exclude/" +
      this.props.course.id +
      "/" +
      this.props.assignment.id +
      "/" +
      this.state.excludeFile.name;
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
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }

  handleIncludeSelected(event) {
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
    if (this.state.includeFile === null) {
      return;
    }
    const path =
      "./api.php/include/" +
      this.props.course.id +
      "/" +
      this.props.assignment.id +
      "/" +
      this.state.includeFile.name;
    this.getBase64(this.state.includeFile, result => {
      axios.post(path, encodeURIComponent(result)).then(res => {
        this.setState({
          addIncluded: this.state.includeFile.name,
          deleteAllIncluded: false
        });
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
    const path =
      "./api.php/rmexclude/" +
      this.props.course.id +
      "/" +
      this.props.assignment.id;
    axios.delete(path).then(res => {
      console.log(res.data);
      this.setState({
        showDeleteExcludeModal: false,
        deleteAllExcluded: true
      });
    });
  }

  reallyDeleteInclude(e) {
    const path =
      "./api.php/rminclude/" +
      this.props.course.id +
      "/" +
      this.props.assignment.id;
    axios.delete(path).then(res => {
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
      submitModal = (
        <button onClick={e => this.yesImSure(e)}>Are you sure?</button>
      );
    }

    let deleteExcludeModal = null;
    if (this.state.showDeleteExcludeModal) {
      deleteExcludeModal = (
        <button onClick={e => this.reallyDeleteExclude(e)}>
          Are you sure?
        </button>
      );
    }

    let deleteIncludeModal = null;
    if (this.state.showDeleteIncludeModal) {
      deleteIncludeModal = (
        <button onClick={e => this.reallyDeleteInclude(e)}>
          Are you sure?
        </button>
      );
    }
    
    return (
      <div>
        <p>Package and Submit all Files for an Assignment</p>
        <p>Assignment: {this.props.assignment.name}</p>
        <button onClick={e => this.onSubmit(e)}>Submit</button>
        {submitModal}
        <button onClick={e => this.onCancel(e)}>Cancel</button>
        <div>
          <p>Exclude</p>
          <button onClick={e => this.onDeleteExclude(e)}>
            Delete All Old files
          </button>
          {deleteExcludeModal}
          <input
            type="file"
            onChange={e => this.handleExcludeSelected(e)}
            accept=".txt,.rtf,.java,.cpp,.c,.hpp,.h"
          />
          <button onClick={e => this.onExclude(e)}>Upload</button>
          <ExcludedList
            cid={this.props.course.id}
            aid={this.props.assignment.id}
            addFile={this.state.addExcluded}
            deleteAll={this.state.deleteAllExcluded}
          />
        </div>
        <div>
          <p>Include</p>
          <button onClick={e => this.onDeleteInclude(e)}>
            Delete All Old files
          </button>
          {deleteIncludeModal}
          <input
            type="file"
            onChange={e => this.handleIncludeSelected(e)}
            accept=".txt,.rtf,.java,.cpp,.c,.hpp,.h"
          />
          <button onClick={e => this.onInclude(e)}>Upload</button>
          <IncludedList
            cid={this.props.course.id}
            aid={this.props.assignment.id}
            addFile={this.state.addIncluded}
            deleteAll={this.state.deleteAllIncluded}
          />
        </div>
        <SubmittedList
          cid={this.props.course.id}
          aid={this.props.assignment.id}
          course={this.props.course}
          updateEnrolled={this.props.updateEnrolled}
        />
      </div>
    );
  }
}
