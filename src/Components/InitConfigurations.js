import React, { Component } from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import {skeletProjectWorkspacePath} from "../Helpers/LocalConfig";

const electron  = window.require('electron');
const fs = electron.remote.require('fs');
const exec = electron.remote.require('child_process').exec;


class InitConfigurations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            host: '',
            username: '',
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const configData = {
            host: event.target.host.value,
            username: event.target.username.value
        };

        reactLocalStorage.setObject('config', configData);

        this.verifyAndCreateSkeletWorkspacePath();
    };

    /**
     *
     * @param path
     */
    async verifyAndCreateSkeletWorkspacePath()
    {
        let path = skeletProjectWorkspacePath();

        if (fs.existsSync(path)) {
            console.info("skeletProjectWorkspacePath / Exist: ")
        } else {
            console.warn("skeletProjectWorkspacePath / Not Exist: ");

            // CREATE LOCAL
            await exec('mkdir '+path,
                function(error, stdout, stderr) {
                    if (error !== null) {
                        console.error('skeletProjectWorkspacePath created: '+path);
                    } else { }
                }
            );
        }
    }

    render() {
        return (
            <div className="App">
                <h1>Configuracion Inicial</h1>
                <div className="dropdown-divider"> </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleDropdownFormEmail1">Server Host:</label>
                        <input type="text" name="host"
                               className="form-control"
                               placeholder="skelet-dev.midas.software" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleDropdownFormPassword1">Username</label>
                        <input type="text" name="username"
                               className="form-control"
                               placeholder="Username" />
                    </div>

                    <button className="btn btn-primary">Guardar</button>
                </form>
            </div>
        );
    }
}

export default InitConfigurations;
