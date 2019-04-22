"use strict";

// Show details about a current assignment, allow assignment submission

export default class Assignment extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.getDate = this.getDate.bind(this);
    this.resetVisible = this.resetVisible.bind(this);
    this.state = {
      default: true,
      submitting: false,
      file: null
    };
    this.props.setReset(this.resetVisible);
  }

  // display default
  resetVisible() {
    this.setState({
      default: true,
      submitting: false
    });
  }

  // get information about an assignment
  async callSingleAssignmentApi() {
    const response = await fetch(
      "./api.php/submitted/student/" +
        this.props.sid +
        "/assignment/" +
        this.props.assignment.id
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  // show submitting inputs
  handleSubmit(e) {
    this.setState({
      default: false,
      submitting: true
    });
  }

  // set state
  handleFileSelect(event) {
    let file = event.target.files;

    if (file) {
      this.setState({
        file: file
      });
    } else {
      console.log("no file");
    }
  }

  // post to the backend
  handleUpload(e) {
    if (this.state.file === null) {
      return;
    }

    const path =
      "./api.php/upload/" +
      this.props.course.id +
      "/" +
      this.props.assignment.id +
      "/" +
      this.props.sid;

    // assuming a single, zipped file was selected
    this.getBase64(this.state.file[0], result => {
      axios.post(path, encodeURIComponent(result)).then(res => {
        console.log(res.data);
        // hackily update previously submitted time
        let strtime = this.getDate();
        this.props.onSubmitTime(
          strtime,
          this.props.assignment.id,
          this.props.course.id
        );
        this.setState({
          default: true,
          submitting: false
        });
      });
    });
  }

  // get the date in a format that Postgres will like
  getDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    let hours = date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let strtime =
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return strtime;
  }

  // convert info to base 64
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

  // go back to default
  handleCancelSubmit(e) {
    this.setState({
      default: true,
      submitting: false
    });
  }

  // display
  render() {
    if (typeof this.props.assignment["submit_time"] === "undefined") {
      this.callSingleAssignmentApi()
        .then(res => {
          let submit_time = 0;
          if (res.length !== 0) {
            submit_time = res[0].submit_time;
          }
          this.props.onSubmitTime(
            submit_time,
            this.props.assignment.id,
            this.props.course.id
          );
        })
        .catch(err => console.log(err));
    }

    let submit_button_text = "submit";
    if (this.props.assignment.submit_time !== "undefined") {
      if (this.props.assignment.submit_time !== 0) {
        // in future, should also check if assignment has closed?
        submit_button_text = "resubmit";
      }
    }

    let submit_warning = null;
    let submitButton = null;
    if (this.props.assignment.closing !== null) {
      if (Date.parse(this.props.assignment.closing) < Date.now()) {
        submit_warning = " submissions are closed";
        submitButton = (
          <button disabled="disabled">{submit_button_text}</button>
        );
      } else {
        // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
        let diffDays = Math.floor(
          parseInt(Date.parse(this.props.assignment.closing) - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        submit_warning =
          " " +
          diffDays +
          (diffDays === 1 ? " day until deadline" : " days until deadline");
        submitButton = (
          <button onClick={e => this.handleSubmit(e)}>
            {submit_button_text}
          </button>
        );
      }
    } else {
      submitButton = (
        <button onClick={e => this.handleSubmit(e)}>
          {submit_button_text}
        </button>
      );
    }

    let mainpage;
    if (this.state.default) {
      mainpage = (
        <div>
          <p>an Assignment</p>
          {submitButton}
          {submit_warning}
          <p>
            previously submitted at time: {this.props.assignment.submit_time}
          </p>
          <p>assignment id: {this.props.assignment.id}</p>
          <p>closing: {this.props.assignment.closing}</p>
          <p>course id: {this.props.assignment.course}</p>
          <p>name: {this.props.assignment.name}</p>
          <p>From course</p>
          <p>name: {this.props.course.name}</p>
          <p>year: {this.props.course.year}</p>
          <p>semester: {this.props.course.semester}</p>
        </div>
      );
    } else {
      // https://stackoverflow.com/questions/46119987/upload-and-read-a-file-in-react
      mainpage = (
        <div>
          <p>Upload a zip file for assignment: {this.props.assignment.name}</p>
          <span>
            <input type="file" onChange={this.handleFileSelect} accept=".zip" />
            <input
              type="button"
              value="Upload"
              onClick={e => this.handleUpload(e)}
            />
            <input
              type="button"
              value="Cancel"
              onClick={e => this.handleCancelSubmit(e)}
            />
          </span>
        </div>
      );
      //
    }

    // when submit, display a new page (or a modal?)
    // need to do file upload, changing names, zipping, put it in the right directory, oh boy

    return <div>{mainpage}</div>;
  }
}
