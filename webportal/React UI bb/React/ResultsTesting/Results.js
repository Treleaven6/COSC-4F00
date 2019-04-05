"use strict";

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waitText: "waiting",
      seconds: 0,
      ready: false
    };
  }

  tick() {
    /*
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
    */
    let tmp = this.state.waitText;
    if (tmp.endsWith("...")) {
      tmp = "waiting";
    } else {
      tmp = tmp + ".";
    }
    this.setState({ waitText: tmp });

    const path = "./api.php/reportready/" + this.props.rid;
    axios.get(path).then(res => {
      let ready = res.data.length > 0;
      if (ready) {
        clearInterval(this.interval);
      }
      //console.log(ready);
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return React.createElement(
      "div",
      null,
      this.state.waitText
    );
  }
}