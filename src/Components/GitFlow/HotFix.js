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

class HotFix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
            response_code: null,
        };

        this.sendNewHotfix = this.sendNewHotfix.bind(this);
        this.backToProjectDetails = this.backToProjectDetails.bind(this);
    };

    // ...
    prepareResponse(response) {

        if (response.data.cod == '00') {

            this.setState({
                loading: false,
                response_code: '00',
            });

        } else {
            alert("Error!\n"+response.data.msg);
        }
    }

    // Send Request.
    sendNewHotfix = (event) => {
        event.preventDefault();

        const feature_name = event.target.name.value;

        this.setState({ loading:true });

        axios.get(
            configGetHost()
            +'/api/gitflow/new-hotfix?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&name='+feature_name
        ).then(response => this.prepareResponse(response))
    };


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

    render() {

        if(! this.state.response_code =='00') {

            this.backToProjectDetails();

            return (
                <h1> Completada!</h1>
            );

        } else {

            return (
                // Go to Login
                <div className="App ">
                    <h3><span className="text-info">{this.props.project_name}</span> / Nuevo Hotfix</h3>
                    <hr />
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Recomendaciones!</h5>

                                    <p className="card-text">

                                        El nombre de un <b><i className="fa fa-heartbeat"></i> hotfix</b> debe de escribirse en minúsculas, y en vez de espacios
                                        utilizar - (guiones).
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <form onSubmit={this.sendNewHotfix}>
                                <div className="form-group">
                                    <label htmlFor="exampleDropdownFormEmail1">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="feature name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleDropdownFormPassword1">Descripcion</label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        className="form-control"
                                        placeholder="" />
                                </div>

                                <button className="btn btn-primary">Guardar</button>
                                <button className="btn btn-danger" onClick={this.backToProjectDetails}>Cancelar</button>
                                {this.state.loading ? <Loading /> : ""}
                            </form>
                        </div>
                    </div>

                </div>
            );
        }
    }
}

export default HotFix;
