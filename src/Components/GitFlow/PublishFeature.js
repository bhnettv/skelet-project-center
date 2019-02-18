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

class PublishFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
            response_code: null,
        };

        this.publishFeature = this.publishFeature.bind(this);
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
            alert("Error de login!");
        }
    }

    // Send Request.
    publishFeature = (event) => {
        event.preventDefault();

        const comment = event.target.comment.value;

        this.setState({ loading:true });

        axios.get(
            configGetHost()
            +'/api/gitflow/publish-feature?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&branch='+this.props.branch_name
            +'&comment='+comment
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
                <h1> Caracteristica Publicada!</h1>
            );

        } else {

            return (
                // Go to Login
                <div className="App App-login">
                    <h3>Publicando Caracteristica <br />
                        <span className="text-info">{this.props.project_name}</span> / <span className="text-danger">{this.props.branch_name}</span>
                    </h3>
                    <form onSubmit={this.publishFeature}>
                        <div className="form-group">
                            <label htmlFor="exampleDropdownFormEmail1">Comentarios:</label>
                            <textarea
                                name="comment"
                                rows="6"
                                className="form-control"
                                placeholder="Escribe una breve descripcion de la caracteristica." />
                        </div>

                        <button className="btn btn-primary">Publicar</button>
                        <button className="btn btn-danger" onClick={this.backToProjectDetails}>Cancelar</button>
                        {this.state.loading ? <Loading /> : ""}
                    </form>
                </div>
            );
        }
    }
}

export default PublishFeature;
