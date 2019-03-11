'use strict';

export default class SubmittedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gotFiles: false,
            files: null,
        };
      }

  componentDidMount() {
    this.getUploaded()
      .then(res => {
          console.log(res);
          this.setState({
              gotFiles: true,
              files: res,
          });
      })
      .catch(err => console.log(err));
  }

  async getUploaded () {
    const response = await fetch("http://localhost:8081/api.php/submitted/assignment/" + this.props.aid);
    if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    if (!Array.isArray(body)) throw Error("bad response: " + body);
    return body;
  };

  render() {
    let blurb = "0 people have submitted files";
    let display = "Hello";

    if (this.state.gotFiles) {
        blurb = this.state.files.length + " people have submitted files";
        display = this.state.files.map(f => (
            <li key={f.id}>{"id: " + f.id + ", firstname: " + f.firstname + ", lastname: " + f.lastname}</li>
        ));
    }

    return (
      <div><p>{blurb}</p>{display}</div>
    );
  }
}
