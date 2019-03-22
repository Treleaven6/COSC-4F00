"use strict";

export default class Assignment extends React.Component {
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

  resetVisible() {
    this.setState({
      default: true,
      submitting: false
    });
  }

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

  handleSubmit(e) {
    this.setState({
      default: false,
      submitting: true
    });
  }

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

  // this entire function is sketchy AF and could explode at any minute
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
    //let zip = new JSZip();

    // convert to drag-and-drop?!
    // https://codepen.io/joezimjs/pen/yPWQbd

    /*
    // select multiple files, will zip it
    // have to add "multiple" to the end of the html input tag
    let readers = [];
    let file = this.state.file;
    for (let i = 0; i < file.length; i++) {
      const f = file[i];
      // https://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
      readers.push(new Promise((resolve, reject) => {
        let fr = new FileReader();  
        fr.readAsText(f);
        fr.onload = function (evt) {
          zip.file(f.name, evt.target.result); // fr.result
          resolve(true);
        };
      }));
    }

    Promise.all(readers).then(function(values) {
      zip.generateAsync({type:"base64"}).then(function (base64) {
        axios.post(path, encodeURIComponent(base64)).then(res => {
          //console.log(res);
          console.log(res.data);
        });
      });
    });
    */

    /*
    // select one file, will zip it
    // check encodeURIcomponent
    let file = this.state.file[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (evt) {
        zip.file(file.name, evt.target.result);
        zip.generateAsync({type:"base64"}).then(function (base64) {
          axios.post(path, base64).then(res => {
            //console.log(res);
            console.log(res.data);
          });
        });
    }
    reader.onerror = function (evt) {
        console.log(err);
    }
    */

    // assuming a single, zipped file was selected
    // sanitize / use "accept" to make sure .zip extension?
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
      });
    });
  }

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

  handleCancelSubmit(e) {
    this.setState({
      default: true,
      submitting: false
    });
  }

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
            <button disabled="disabled">
              {submit_button_text}
            </button>
          );
      } else {
        // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
        let diffDays = Math.floor(parseInt(Date.parse(this.props.assignment.closing) - Date.now()) / (1000 * 60 * 60 * 24))
        submit_warning = " " + diffDays + (diffDays === 1 ? " day until deadline" : " days until deadline");
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
          <p>pdf: {this.props.assignment.pdf}</p>
          <p>template: {this.props.assignment.template}</p>
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
