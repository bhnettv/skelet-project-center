import React, { Component } from 'react';
import './../../App.css';
import ProjectItem from "./ProjectItem";
import {reactLocalStorage} from "reactjs-localstorage";
import {getUsername, getUserToken} from "../../Helpers/login";
import Loading from "../ShowMessage";
import {configGetHost} from "../../Helpers/LocalConfig";

class ProjectsManager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: null,
            user    : [],
        };
    }

    fetchFirst() {

        const userData = reactLocalStorage.getObject('user.data');

        fetch(configGetHost()+'/api/projects/get?user='+userData.username+'&token='+userData.token)
            .then(function (response) {
                return response.json();
            }).then(data => this.setState({ projects: data.projects }));
    }

    componentDidMount() {
        if (this.props.parent.state.user !== null) {
            this.setState({ user: this.props.parent.state.user });
        }
        this.fetchFirst();
    }

    render() {
        const projects  = this.state.projects;
        const user      = this.props.parent.state.user;

        if (this.state.projects !=null) {
            return (
                <div className="row">
                    {projects.map((project) => (
                        <ProjectItem
                            parent={this.props.parent}
                            title={project.name}
                            description={project.description}
                            key1={project.key}
                            remote_path={project.path}
                            server={project.server}
                        />
                    ))}
                </div>
            );
        } else {
            return (
                <div  className="align-content-center">
                    <Loading />
                </div>
            );
        }
    }
}

export default ProjectsManager;