'use strict';

export default class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.state = {
      default: true,
      submitting: false,
      file: null
    };
  }

  async callSingleAssignmentApi() {
    const response = await fetch(
      "http://localhost:8081/api.php/submitted/student/" +
        this.props.sid +
        "/assignment/" +
        this.props.assignment.id
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

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
    const path = "http://localhost:8081/api.php/upload/" + this.props.course.id + "/" + this.props.assignment.id + "/" + this.props.sid;
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
    // select one file of any type, will zip it
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
    this.getBase64(this.state.file[0], (result) => {
      //result = encodeURI(result);
      axios.post(path, encodeURIComponent(result)).then(res => {
        //console.log(res);
        console.log(res.data);
      });
    });
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
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

    let mainpage;
    if (this.state.default) {
      mainpage = (
        <div>
          <p>an Assignment</p>
          <button onClick={e => this.handleSubmit(e)}>
            {submit_button_text}
          </button>
          <p>
            previously submitted at time: {this.props.assignment.submit_time}
          </p>
          <p>assignment id: {this.props.assignment.id}</p>
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
        <span>
          <input type="file" name="myFile" onChange={this.handleFileSelect} accept=".zip"/>
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
      );
      //
    }

    // when submit, display a new page (or a modal?)
    // need to do file upload, changing names, zipping, put it in the right directory, oh boy

    return <div>{mainpage}</div>;
  }
}
