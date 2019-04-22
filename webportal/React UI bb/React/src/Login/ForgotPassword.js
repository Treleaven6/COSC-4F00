"use strict";

// Allow user to recover their password
export default class ForgotPassword extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      warning: ""
    };
  }

  // this is how React handles input fields
  updateEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  // call the API to update the email, display warning with results
  onRequest(e) {
    e.preventDefault();

    if (this.state.email === "") {
      return;
    }

    this.callApi(encodeURIComponent(this.state.email.trim()))
      .then(res => {
        if (res.length === 0) {
          this.setState({
            warning: "email not found"
          });
        } else if (res.length > 1) {
          throw Error("Duplicate emails!");
        } else {
          this.setState({
            warning: "sent to admin"
          });
          // how to actually send to admin?
        }
      })
      .catch(err => console.log(err));
  }

  // call API
  async callApi(email) {
    const response = await fetch("./api.php/email/" + email);
    if (response.status !== 200)
      throw Error(response.status + ", " + response.statusText);
    const body = await response.json();
    if (!Array.isArray(body))
      throw Error("bad response, check DB configuration");
    return body;
  }

  // tell parent (Login) to display default
  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  // display
  render() {
    return (
      <div>
        <p>COMING SOON</p>
        <form>
          Email:{" "}
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={e => this.updateEmail(e)}
          />
          <input
            type="submit"
            value="Request"
            onClick={e => this.onRequest(e)}
          />
          <input type="button" value="Back" onClick={e => this.onBack(e)} />
        </form>
        {this.state.warning}
      </div>
    );
  }
}
