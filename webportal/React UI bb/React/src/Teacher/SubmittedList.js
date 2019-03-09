'use strict';

export default class SubmittedList extends React.Component {
    componentDidMount() {
        this.callClassApi()
          .then(res => {
            if (Object.keys(res).length === 0) {
              // do nothing? display a little warning?
            } else {
              this.setState({
                courses: res
              });
              this.props.onCourses(res);
              this.classesDidMount();
            }
          })
          .catch(err => console.log(err));
      }
    
      classesDidMount() {
        for (let i = 0; i < this.state.courses.length; ++i) {
          let course = this.state.courses[i];
          this.callAssApi(course.id)
            .then(res => {
              let courses = this.state.courses;
              course["assignments"] = res;
              courses[i] = course;
              this.setState({
                courses: courses
              });
              this.props.onCourses(courses);
            })
            .catch(err => console.log(err));
        }
      }
    
      async callClassApi() {
        const response = await fetch(
          "http://localhost:8081/api.php/" +
            (this.state.isTeacher ? "teachingList" : "enrolledList") +
            "/" +
            this.state.id
        );
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
      };
    
      async callAssApi(cid) {
        const response = await fetch("http://localhost:8081/api.php/assigned/" + cid);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
      };

  render() {
    let assList = null;
    if (typeof this.props.course["assignments"] !== "undefined") {
      assList = this.props.course["assignments"].map(assignment => (
        <li key={assignment.id}>
          <span
            onClick={() =>
              this.props.onClick("assignment", assignment.course, assignment.id)
            }
          >
            {"name: " + assignment.name}
          </span>
        </li>
      ));
    }
    return <ul>{assList}</ul>;
  }
}