import React, { Component } from 'react';

export class ForgotPassword extends Component {
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
      // sanitize / check database
      // if good, send to parent 
      console.log("requesting reset for: " + this.state.email);
      this.props.goBack();
      // if bad, display a little message
    }
  
    onBack(e) {
      e.preventDefault();
      this.props.goBack();
    }
  
    render() {
      return (
        <form>
            Email: <input type="text" name="email" value={this.state.email} onChange={e => this.updateEmail(e)}></input>
            <input type="submit" value="Request" onClick={(e) => this.onRequest(e)}></input>
            <input type="button" value="Back" onClick={(e) => this.onBack(e)}></input>
        </form>
      );
    }
}