import React, { Component } from 'react';
import './../../App.css';
import './../../css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import axios from 'axios'
import Loading from "../ShowMessage";
import {configGetHost} from "../../Helpers/LocalConfig";
import {getUsername, getUserToken} from "../../Helpers/login";
import ProjectsDetails from "../Projects/ProjectsDetails";
import {getRemoteFile} from "../../Helpers/ProjectSftpSync";
import {downloadFromRemoteServer, syncFromRemoteServer} from "../../Helpers/ProjectLocalInfo";

class UnitTestsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
            response_code: null,
            http_response: {},
            local_section: 'default',
        };

        this.sendRunUnitTests       = this.sendRunUnitTests.bind(this);
        this.backToProjectDetails   = this.backToProjectDetails.bind(this);
        this.loadInSection          = this.loadInSection.bind(this);
    };

    // Send Request Create New Migration.
    sendRunUnitTests = (event) => {
        event.preventDefault();

        //const migration_name = event.target.name.value;

        this.setState({ loading: true });

        axios.get(
            configGetHost()
            +'/api/tests/run?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&name='
        ).then(response => this.setState({
                loading: false,
                http_response: response.data,
                //local_section: 'show_result_response',
            })
        )
    };

    handleRunResponse()
    {
        if (this.state.http_response.cod =='00') {

            let parent = this.props.parent;

            // Report to parent:
            //parent.setState({sync_status: 'downloading'});

            return (
                <div>
                    <div className="alert alert-secondary" role="alert">
                        <pre>
                            {this.state.http_response.results}
                        </pre>
                    </div>
                </div>
            );
        }
        else if(this.state.http_response.cod == null) {
            return (
                <div>
                    <div className="alert alert-secondary" role="alert">
                        <pre>
                            No hay resultados para mostrar.
                        </pre>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error!</h4>
                    </div>
                </div>
            );
        }
    }


    loadSection()
    {
        let section = this.state.local_section;
        if (section === 'default') {
            return this.showRunUnitTestsConfirm();

        }  else if (section === 'run_migration_confirm') {
            return this.showRunUnitTestsConfirm();

        }  else if (section === 'show_result_response') {
            return this.handleRunResponse();

        }
    }

    loadInSection(section_name)
    {
        this.setState({ local_section: section_name })
    }


    backToProjectDetails()
    {
        this.props.parent.loadComponent1(
            <ProjectsDetails
                title={this.props.project_name}
                parent={this.props.parent}
                key1={this.props.project_key}
            />
        );
    }

    showRunUnitTestsConfirm()
    {
        return (
            <div className="p-4">
                <h5 className="card-title">Seleccione el test para ejecutar:</h5>
                <div className="form-row align-items-center">
                    <div className="col-auto my-1">
                        <select className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                            <option selected>Ejecutar todos los tests...</option>
                            <option value="1">tests/DepositCommerceTest4.php</option>
                            <option value="1">tests/DepositCommerceTest3.php</option>
                            <option value="1">tests/DepositCommerceTest2.php</option>
                        </select>
                    </div>
                    <div className="col-auto my-1">
                        {this.state.loading
                            ? <Loading msg="Ejecutando tests..." />
                            : <a href="#" className="btn btn-primary" onClick={this.sendRunUnitTests}>Si, ejecutar.</a>
                        }
                    </div>
                </div>

            </div>
        );
    }

    render() {
        return (
            <div>
                <h3><i className="fa fa-tasks" /> <span className="text-info">{this.props.project_name}</span> / Tests Unitarios</h3>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <h4> Acciones: </h4>
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action"
                               onClick={()=>{this.loadInSection('default')}}>
                              <i className="fa fa-circle-o" />  Limpiar pantalla
                            </a>
                            <a href="#" className="list-group-item list-group-item-action"
                               onClick={this.backToProjectDetails}>
                                <i className="fa fa-reply-all text-info" />  Detalle del Proyecto.
                            </a>
                        </div>
                    </div>
                    <div className="col-8">
                        {this.loadSection()}
                    </div>
                </div>

                <pre>
                    {this.handleRunResponse()}
                </pre>

            </div>
        );
    }
}

export default UnitTestsManager;