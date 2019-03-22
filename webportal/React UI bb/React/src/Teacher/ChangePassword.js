"use strict";

// Allow user to update their password
export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmPassword: "",
      warning: ""
    };
  }

  updateNewPassword(e) {
    e.preventDefault();
    let newPassword = e.target.value;
    let warningText = "";
    if (this.state.confirmPassword !== newPassword) {
      warningText = "passwords do not match";
    }
    this.setState({
      newPassword: newPassword,
      warning: warningText
    });
  }

  updateConfirmPassword(e) {
    e.preventDefault();
    let confirmPassword = e.target.value;
    let warningText = "";
    if (this.state.newPassword !== confirmPassword) {
      warningText = "passwords do not match";
    }
    this.setState({
      confirmPassword: confirmPassword,
      warning: warningText
    });
  }

  onRequest(e) {
    e.preventDefault();

    if (this.state.newPassword === "") {
      this.setState({
        warning: "password cannot be empty"
      });
      return;
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        warning: "passwords do not match"
      });
      return;
    }

    let path =
      "./api.php/password/" + this.props.tid + "/" + this.state.newPassword;
    axios.post(path).then(res => {
      this.props.goBack();
    });
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  render() {
    return (
      <div>
        <form>
          {"New password:"}
          <input
            type="text"
            name="newPassword"
            value={this.state.newPassword}
            onChange={e => this.updateNewPassword(e)}
          />
          {"Confirm password:"}
          <input
            type="text"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={e => this.updateConfirmPassword(e)}
          />
          <input
            type="submit"
            value="Change"
            onClick={e => this.onRequest(e)}
          />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
        {this.state.warning}
      </div>
    );
  }
}
