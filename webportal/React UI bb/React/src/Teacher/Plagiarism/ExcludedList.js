"use strict";

export default class ExcludedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      excluded: []
    };
  }

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

  async getCluded() {
    //console.log("get cluded");
    const response = await fetch(
      "./api.php/excluded/" + this.props.cid + "/" + this.props.aid
    );
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    return body;
  }

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
