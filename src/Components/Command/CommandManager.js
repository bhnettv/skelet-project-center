import React, { Component } from 'react';
import './../../App.css';
import './../../css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import axios from 'axios'
import {configGetHost} from "../../Helpers/LocalConfig";
import {getUsername, getUserToken} from "../../Helpers/login";

class CommandManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            parent: null,
            response_code: null,
            response: {},
        };

        this.sendCommandToServer = this.sendCommandToServer.bind(this);
    };

    componentDidMount()
    {
        this.sendCommandToServer();
    }

    componentWillReceiveProps()
    {
        this.sendCommandToServer();
    }

    // Send Request.
    sendCommandToServer()
    {
        const command = this.props.command;

        this.setState({ response_code:false });

        axios.get(
            configGetHost()
            +'/api/command/exec?user='+getUsername()
            +'&token='+getUserToken()
            +'&project='+this.props.project_key
            +'&com='+command
        ).then(response => this.prepareResponse(response))
    }

    prepareResponse(response)
    {
        if (response.data.cod == '00') {

            this.setState({
                loading: false,
                response_code: response.data.cod,
                response: response.data,
            });

        } else {
            alert("Error!\n"+response.data.msg);
        }
    }


    render() {

        if (! this.state.response_code) {

            return (
                // Go to Login
                <div align="center" className="justify-content-center align-middle p-2 bd-highlight">
                    <span className="badge badge-pill badge-warning">
                        {this.props.command} <i className="fa fa-spinner fa-spin" />
                    </span>
                </div>
            );
        } else {

            if(this.state.response_code =='00') {
                return (
                    <pre>{this.state.response.result}</pre>
                );
            }
        }
    }

}

export default CommandManager;
