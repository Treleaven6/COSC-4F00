"use strict";

// Display a list of files to exclude / ignore from plagiarism detection

export default class ExcludedList extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      excluded: []
    };
  }

  // get list of files only after component mount
  componentDidMount() {
    this.getCluded()
      .then(res => {
        // excluded: Array.from(res.exclude),
        this.setState({
          excluded: res
        });
      })
      .catch(err => console.log(err));
  }

  // call the backend
  async getCluded() {
    const response = await fetch(
      "./api.php/excluded/" + this.props.cid + "/" + this.props.aid
    );
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    return body;
  }

  // display
  render() {
    let excluded_blurb = "No files to exclude";
    let excluded = this.state.excluded;
    let jsx = "";
    if (excluded) {
      if (this.props.deleteAll) {
        excluded.length = 0;
      } else if (this.props.addFile) {
        if (!excluded.includes(this.props.addFile)) {
          excluded.push(this.props.addFile);
        }
      }
      excluded_blurb = excluded.length + " excluded files";
      jsx = excluded.map(n => <li key={n}>{n}</li>);
    }

    return (
      <div>
        <p>{excluded_blurb}</p>
        <ul>{jsx}</ul>
      </div>
    );
  }
}
