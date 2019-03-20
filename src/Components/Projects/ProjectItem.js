import React from 'react';
import ProjectSync from "../FileWatcher/ProjectSync";
import ProjectsDetails from "./ProjectsDetails";
import {reactLocalStorage} from "reactjs-localstorage";
import {skeletProjectWorkspacePath} from "../../Helpers/LocalConfig";
import {getProjectLocalInfo} from "../../Helpers/ProjectLocalInfo";

const electron  = window.require('electron');
const exec = electron.remote.require('child_process').exec;

function details(props) {

    props.parent.loadComponent1(
        <ProjectsDetails
            title={props.title}
            parent={props.parent}
            key1={props.key1}
        />
    );
    const local_path    = skeletProjectWorkspacePath()+ "/"+props.key1;
    const remote_path   = props.remote_path;
    let projectData     = {
        title: props.title,
        local_path: local_path,
        remote_path: remote_path,
        server: props.server
    };
    reactLocalStorage.setObject('project.'+props.key1, projectData);
}

function openPhpStormProject(props) {
    exec('pstorm '+getProjectLocalInfo(props.key1).local_path,
        function(error, stdout, stderr) {
            if (error !== null) {
                console.error(stderr);
            } else { }
        }
    );
}
const ProjectItem = (props) => (
    <div className="col-sm-4">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title font-weight-bold">{props.title}</h5>
                <p className="card-text">{props.description}</p>
                <a href="#" className="btn btn-success mr-1" onClick={() => openPhpStormProject(props)}>
                    <i className="fa fa-pencil-square-o"></i>
                </a>
                <a href="#" className="btn btn-warning mr-1" onClick={() => details(props)}>
                    <i className="fa fa-dashboard"></i>
                </a>
                <ProjectSync project={props} parent={props.parent} />
            </div>
        </div>
    </div>);

export default ProjectItem;