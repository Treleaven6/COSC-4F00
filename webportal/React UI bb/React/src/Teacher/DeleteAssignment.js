"use strict";

export default class DeleteAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onBack(e) {
    e.preventDefault();
    this.props.goBack();
  }

  onConfirm(e) {
    e.preventDefault();
    let path = "./api.php/delass/" + this.props.id;
    axios.post(path).then(res => {
      this.props.refreshList();
    });
  }

  render() {
    return (
      <div>
        <form>
          <h3>Delete Assignment: {this.props.name}</h3>
          <input
            type="submit"
            value="Confirm"
            onClick={e => this.onConfirm(e)}
          />
          <input type="button" value="Cancel" onClick={e => this.onBack(e)} />
        </form>
      </div>
    );
  }
}
