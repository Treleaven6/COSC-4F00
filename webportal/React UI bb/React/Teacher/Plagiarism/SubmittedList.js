'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class SubmittedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gotFiles: false,
            files: null
        };
    }

    componentDidMount() {
        this.getUploaded().then(res => {
            console.log(res);
            this.setState({
                gotFiles: true,
                files: res
            });
        }).catch(err => console.log(err));
    }

    getUploaded() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const response = yield fetch("http://localhost:8081/api.php/submitted/assignment/" + _this.props.aid);
            if (response.status !== 200) throw Error(response.status + ", " + response.statusText);
            const body = yield response.json();
            if (!Array.isArray(body)) throw Error("bad response: " + body);
            return body;
        })();
    }

    render() {
        let blurb = "0 people have submitted files";
        let display = "Hello";

        if (this.state.gotFiles) {
            blurb = this.state.files.length + " people have submitted files";
            display = this.state.files.map(f => React.createElement(
                "li",
                { key: f.id },
                "id: " + f.id + ", firstname: " + f.firstname + ", lastname: " + f.lastname
            ));
        }

        return React.createElement(
            "div",
            null,
            React.createElement(
                "p",
                null,
                blurb
            ),
            display
        );
    }
}