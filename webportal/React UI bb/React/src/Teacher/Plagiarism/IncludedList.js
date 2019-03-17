"use strict";

export default class SubmittedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      included: null
    };
  }

  componentDidMount() {
    this.getCluded()
      .then(res => {
        this.setState({
          included: res
        });
      })
      .catch(err => console.log(err));
  }

  async getCluded() {
    //console.log("get cluded");
    const response = await fetch(
      "./api.php/included/" + this.props.cid + "/" + this.props.aid
    );
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    return body;
  }

  render() {
    let included_blurb = "No files to include";
    let included = this.state.included;
    let jsx = "";
    if (included) {
      if (this.props.deleteAll) {
        included.length = 0;
      } else if (this.props.addFile) {
        if (!included.includes(this.props.addFile)) {
          included.push(this.props.addFile);
        }
      }
      included_blurb = included.length + " included files";
      jsx = included.map(n => <li key={n}>{n}</li>);
    }

    return (
      <div>
        <p>{included_blurb}</p>
        <ul>{jsx}</ul>
      </div>
    );
  }
}
