'use strict';

export default class ForgotPassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        warning: '',
      };
    }
  
    updateEmail(e) {
      this.setState({
        email: e.target.value
      });
    }
  
    onRequest(e) {
      e.preventDefault();

      if (this.state.email === '') {
          return;
      }

      this.callApi(
        encodeURIComponent(this.state.email.trim()),
      )
        .then(res => {
          if (res.length === 0) {
            this.setState({
              warning: 'email not found',
            });
          } else if (res.length > 1) {
            throw Error("Duplicate emails!");
          } else {
            this.setState({
              warning: "sent to admin",
            });
            // how to actually send to admin?
          }
        })
        .catch(err => console.log(err));
    }

    async callApi (email) {
      const response = await fetch("http://localhost:8081/api.php/email/" + email);
      if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
      const body = await response.json();
      if (!Array.isArray(body)) throw Error("bad response, check DB configuration");
      return body;
    };
  
    onBack(e) {
      e.preventDefault();
      this.props.goBack();
    }
  
    render() {
      return (
        <div>
          <form>
              Email: <input type="text" name="email" value={this.state.email} onChange={e => this.updateEmail(e)}></input>
              <input type="submit" value="Request" onClick={(e) => this.onRequest(e)}></input>
              <input type="button" value="Back" onClick={(e) => this.onBack(e)}></input>
              
          </form>
          {this.state.warning}
        </div>
      );
    }
}