import React, { Component } from 'react';
import './../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import {skeletProjectWorkspacePath} from "../Helpers/LocalConfig";

const electron  = window.require('electron');
const mainWindow = electron.remote.getCurrentWindow();
const fs = electron.remote.require('fs');
const exec = electron.remote.require('child_process').exec;
const localStorage = electron.remote.require('electron-json-storage');

class InitConfigurations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            host     : '',
            username : '',
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const configData = {
            host: event.target.host.value,
            username: event.target.username.value,
            app_type: event.target.app_type.value,
            app_server: event.target.app_server.value,
        };

        reactLocalStorage.setObject('config', configData);
        localStorage.set('config', configData);

        this.verifyAndCreateSkeletWorkspacePath();

        if (event.target.app_server.value) {
            mainWindow.loadURL('http://'+event.target.app_server.value);
        }
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
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="exampleDropdownFormEmail1">Host Servidor Central:</label>
                                <input type="text" name="host"
                                       className="form-control"
                                       placeholder="skelet-center-dev.midas.software"
                                       value="http://skelet-center-dev.midas.software"
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="exampleDropdownFormPassword1">Nombre de Usuario:</label>
                                <input type="text" name="username"
                                       className="form-control"
                                       placeholder="Username" />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">App Tipo</label>
                                <select className="form-control" name="app_type">
                                    <option value="dev-station">Developer Station</option>
                                    <option value="central-station">Central Station</option>
                                </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="exampleDropdownFormEmail1">Servidor de App:</label>
                                <input type="text" name="app_server"
                                       className="form-control"
                                       placeholder="10.0.0.151:3000"
                                />
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary">Guardar</button>
                </form>
            </div>
        );
    }
}

export default InitConfigurations;
