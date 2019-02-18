import React, { Component } from 'react';
import './../../App.css';
import './../../css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import Feature from "../GitFlow/Feature";
import {configGetHost} from "../../Helpers/LocalConfig";
import {getUsername, getUserToken} from "../../Helpers/login";
import ProjectItem from "./ProjectItem";
import Login from "../Login/Login";
import PublishFeature from "../GitFlow/PublishFeature";
import {syncFromRemoteServer} from "../../Helpers/ProjectLocalInfo";
import HotFix from "../GitFlow/HotFix";
import ShowMessage from "../ShowMessage";
import CommandManager from "../Command/CommandManager";

class ProjectsDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            project_status  : [],
            estado  : [],
            command  : null,
        };
        this.createNewFeature         = this.createNewFeature.bind(this);
        this.branchCheckOutOnResponse = this.branchCheckOutOnResponse.bind(this);
        this.createNewHotfix          = this.createNewHotfix.bind(this);
        this.refreshProjectDetails    = this.refreshProjectDetails.bind(this);
        this.commandScreenShowStatus  = this.commandScreenShowStatus.bind(this);
        this.commandHandleChange      = this.commandHandleChange.bind(this);
        this.statusBoard              = this.statusBoard.bind(this);
    }

    getProjectGeneralStatus()
    {
        fetch(configGetHost()+'/api/repo/project-status?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.key1
        )
        .then(function (response) {
            return response.json();
        }).then(data => this.setState({ project_status: data }));
    }

    branchCheckOut(branch_name)
    {
        fetch(configGetHost()+'/api/repo/branch-checkout?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.key1
            +'&branch='+branch_name
        )
        .then(function (response) {
            return response.json();
        }).then(data => this.branchCheckOutOnResponse(data, branch_name));
    }

    branchCheckOutOnResponse(response, branch_name)
    {
        if (response.cod =='00') {
            this.setState({ project_status: response });
            syncFromRemoteServer(this.props.key1);
        }
    }

    componentDidMount() {
        //this.fetchFirst();
        this.getProjectGeneralStatus();
    }

    createNewFeature()
    {
        this.props.parent.loadComponent1(
            <Feature
                parent={this.props.parent}
                project_key={this.props.key1}
                project_name={this.props.title}
            />
        );
    }

    createNewHotfix()
    {
        this.props.parent.loadComponent1(
            <HotFix
                parent={this.props.parent}
                project_key={this.props.key1}
                project_name={this.props.title}
            />
        );
    }

    preparePublishFeature(branch_name)
    {
        this.props.parent.loadComponent1(
            <PublishFeature
                parent={this.props.parent}
                project_key={this.props.key1}
                project_name={this.props.title}
                branch_name={branch_name}
            />
        );
    }

    renderBranchesButtons(branch_name)
    {
        let buttons;
        let button_checkout = (
            <button type="button" className="btn btn-sm" title="Entrar a esta rama."
                    onClick={()=>this.branchCheckOut(branch_name)}>
                <i className="fa fa-arrow-circle-down"></i>
            </button>
        );

        if (branch_name == this.state.project_status.current_branch)  {
            buttons =(
                <div>
                    {button_checkout}
                    <button type="button" className="btn btn-info btn-sm" title="Publicar caracteristica."
                            onClick={()=>this.preparePublishFeature(branch_name)}>
                        <i className="fa fa-check-circle"></i>
                    </button>
                </div>
            );
        } else {
            buttons =(
                <div>
                    {button_checkout}
                </div>
            );
        }

        return buttons;
    }

    refreshProjectDetails()
    {
        this.props.parent.loadComponent1(
            <ProjectsDetails
                title={this.props.title}
                parent={this.props.parent}
                key1={this.props.key1}
            />
        );
    }


    statusBoard()
    {
        if (! this.state.command) {

            const branches          = this.state.project_status.branches;
            let   status_plaint     = this.state.project_status.status_plaint;
            return (
                <div>
                    <div className="alert alert-dark" role="alert">
                        {/*<h4 className="alert-heading">Estado de repositorio (git):</h4>*/}
                        <p><pre>{status_plaint}</pre></p>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">Ramas Activas</div>
                        <div className="card-body text-dark">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {branches.map((branch) => (
                                    <tr>
                                        <th scope="row">1</th>
                                        <td><h4>{branch}</h4></td>
                                        <td>feature</td>
                                        <td>
                                            {this.renderBranchesButtons(branch)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            );
        } else {
            return this.commandScreenShowStatus();
        }
    }

    commandScreenShowStatus()
    {
        return (
            <CommandManager
                parent={this.props.parent}
                project_key={this.props.key1}
                project_name={this.props.title}
                command={this.state.command}
            />
        );
    }

    commandHandleChange(event) {
        if (event.key !== 'Enter') { return; }
        this.setState({ command: event.target.value });
    }


    // replaceAll(str, find, replace) {
    //     return str.replace(new RegExp(find, 'g'), replace);
    // }

    render()
    {
        const current_branch    = this.state.project_status.current_branch;

        if ( this.state.project_status.branches != null) {
            return (
                <div className="row">
                    <div className="container">
                        <nav className="navbar navbar-light bg-light">
                            <a className="navbar-brand text-info" href="#" onClick={this.refreshProjectDetails}>
                                {this.props.title} / <span className="text-danger">{current_branch}</span>
                            </a>

                            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                <div className="btn-group dropleft" role="group">
                                    <button id="btnGroupDrop1" type="button" className="btn btn-secondary dropdown-toggle"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Opciones
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                        <a className="dropdown-item" href="#"
                                           onClick={this.createNewFeature}>
                                            Nuevo (<b>feature</b>).
                                        </a>
                                        <a className="dropdown-item" href="#"
                                           onClick={this.createNewHotfix}>
                                            Nuevo (<b>hotfix</b>).
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {this.statusBoard()}

                        <div className="row">
                            <div className="col"></div>
                            <div className="col-4"></div>
                        </div>

                    </div>

                    <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-bottom">
                        <div className="input-group">
                            <div className="input-group-append dropup">
                                <button className="btn btn-outline-secondary dropdown-toggle" type="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Dropdown
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <a className="dropdown-item" href="#">Something else here</a>
                                    <div role="separator" className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#">Separated link</a>
                                </div>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Text input with dropdown button"
                                onKeyPress={this.commandHandleChange}
                            />
                        </div>
                    </nav>
                </div>
            );

        } else {
            return ( <ShowMessage />);
        }

    }
}

export default ProjectsDetails;