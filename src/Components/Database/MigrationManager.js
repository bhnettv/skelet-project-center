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
import {skeletOpenFileFromRemote} from "../../Helpers/LocalFileHelper";

class MigrationManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
            response_code: null,
            http_response: {},
            local_section: 'default',
        };

        this.sendCreateNewMigration  = this.sendCreateNewMigration.bind(this);
        this.backToProjectDetails    = this.backToProjectDetails.bind(this);
        this.handleNewMigrationResponse = this.handleNewMigrationResponse.bind(this);
        this.loadInSection          = this.loadInSection.bind(this);
    };

    // Send Request Create New Migration.
    sendCreateNewMigration = (event) => {
        event.preventDefault();

        const migration_name = event.target.name.value;
        const migration_create_type = event.target.create_type.value;
        const migration_create_name = event.target.table_name.value;

        this.setState({ loading: true });
        let parent  = this.props.parent;
        const this1 = this;

        axios.get(
            configGetHost()
            +'/api/migration/create?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&name='+migration_name
            +'&create_type='+migration_create_type
            +'&create_name='+migration_create_name
        ).then( function (response) {

            // Report to parent:
            parent.setState({sync_status: 'downloading'});
            downloadFromRemoteServer(this1.props.project_key,'database/migrations/', function (resp) {
                parent.setState({sync_status: 'synchronized'});

                this1.setState({
                    loading: false,
                    http_response: response.data,
                    local_section: 'new_migration_response',
                });
            });
        })
    };

    sendRunMigrations = (event) => {
        event.preventDefault();

        //const migration_name = event.target.name.value;

        this.setState({ loading: true });

        const this1 = this;

        axios.get(
            configGetHost()
            +'/api/migration/run?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&name='
        ).then(function (response) {
            this1.setState({
                loading: false,
                http_response: response.data,
                local_section: 'show_result_response',
            });
        })
    };

    sendRunDbSeeder = (event) => {
        event.preventDefault();

        //const migration_name = event.target.name.value;
        this.setState({ loading: true });

        axios.get(
            configGetHost()
            +'/api/database/seed?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&name='
        ).then(response => this.setState({
                loading: false,
                http_response: response.data,
                local_section: 'show_result_response',
            })
        )
    };

    handleNewMigrationResponse()
    {
        if (this.state.http_response.cod === '00') {
            return (
                <div>
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Migración creada!</h4>
                        <p>La migración fue creada con excito.</p>
                        <hr />
                        <a href="#" className="btn btn-primary" onClick={() => {
                            skeletOpenFileFromRemote(this.props.project_key, this.state.http_response.file);
                        }}>Abrir</a>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error al crear la Migración!</h4>
                    </div>
                </div>
            );
        }
    }

    handleRunMigrationsResponse()
    {
        if (this.state.http_response.cod =='00') {

            let parent = this.props.parent;

            // Report to parent:
            //parent.setState({sync_status: 'downloading'});

            return (
                <div>
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Resultado:</h4>
                        <hr />
                        <pre>
                            {this.state.http_response.results}
                        </pre>

                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error al crear la Migración!</h4>
                    </div>
                </div>
            );
        }
    }

    loadSection()
    {
        let section = this.state.local_section;
        if (section === 'default') {
            return this.createNewMigration();

        } else if (section === 'new_migration_response') {
            return this.handleNewMigrationResponse();

        } else if (section === 'run_migration_confirm') {
            return this.showMigrationsConfirm();

        } else if (section === 'run_db_seeder_confirm') {
            return this.showDbSeederRunConfirm();

        } else if (section === 'show_result_response') {
            return this.handleRunMigrationsResponse();

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

    createNewMigration()
    {
        return (
            <form onSubmit={this.sendCreateNewMigration}>
                <h4> Crear nueva migración</h4>
                <div className="form-group">
                    <label htmlFor="exampleDropdownFormEmail1">Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="migration name" />
                </div>

                <div className="input-group input-group-lg mb-3">
                    <select className="custom-select custom-select-lg" name="create_type">
                        <option value="--table=">--table=</option>
                        <option value="--create=">--create=</option>
                    </select>

                    <div className="input-group-prepend input-group-lg col-md-8 p-0">
                        <input
                            type="text"
                            name="table_name"
                            className="form-control"
                            placeholder="table name" />
                    </div>
                </div>
                {this.state.loading ? <Loading msg="Creando migración..." /> : <button className="btn btn-primary mr-1">Crear</button>}
            </form>
        );
    }

    showMigrationsConfirm()
    {
        return (
            <div className="p-4">
                <h5 className="card-title">Se ejecutaran las migraciones pendientes.</h5>
                <p className="card-text">Estas de acuerdo con ejecutar las migraciones pendientes?</p>
                {this.state.loading ? <Loading msg="Ejecutando migraciones..." /> : <a href="#" className="btn btn-primary" onClick={this.sendRunMigrations}>Si, ejecutar.</a>}
            </div>
        );
    }

    showDbSeederRunConfirm()
    {
        return (
            <div className="p-4">
                <h5 className="card-title">Se ejecutaran los Seeders Configurados.</h5>
                <p className="card-text">Estas de acuerdo con ejecutar los Seeders?</p>
                {this.state.loading ? <Loading msg="Ejecutando seeders..." /> : <a href="#" className="btn btn-primary" onClick={this.sendRunDbSeeder}>Si, ejecutar.</a>}
            </div>
        );
    }

    render() {

        return (
            <div>
                <h3><i className="fa fa-database" /> <span className="text-info">{this.props.project_name}</span> / Manejo de Migraciones</h3>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <h4> Acciones: </h4>
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action"
                               onClick={()=>{this.loadInSection('default')}}>
                              <i className="fa fa-circle-o" />  Nueva Migración
                            </a>
                            <a href="#" className="list-group-item list-group-item-action"
                               onClick={()=>{this.loadInSection('run_migration_confirm')}}>
                                <i className="fa fa-circle-o" /> Ejecutar Migraciones
                            </a>
                            <a href="#" className="list-group-item list-group-item-action"
                                onClick={()=>{this.loadInSection('run_db_seeder_confirm')}}>
                                <i className="fa fa-circle-o" /> Ejecutar Seeders
                            </a>
                            <hr/>
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

            </div>
        );
    }
}

export default MigrationManager;