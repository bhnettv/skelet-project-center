import React, { Component } from 'react';
import '../App.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import ProjectsDetails from "./Projects/ProjectsDetails";
import DeveloperDashBoard from "./Dashboards/DeveloperDashBoard";
const {app} = window.require('electron').remote;

class HeaderBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        };

        this.setUser        = this.setUser.bind(this);
        this.loadProjectList= this.loadProjectList.bind(this);
        this.syncShowStatus = this.syncShowStatus.bind(this);
    }

    setUser(userData) {
        this.setState({ user:userData })
    }

    loadProjectList()
    {
        this.props.parent.loadComponent1(
            <DeveloperDashBoard parent={this.props.parent} />
        );
    }

    syncShowStatus()
    {
        if (this.props.sync_status =='uploading') {
            return (
              <span className="text-warning">
                  <i className="fa fa-spinner fa-spin" /> sync...
              </span>
            );
        } else if (this.props.sync_status =='downloading') {
            return (
                <span className="text-warning">
                      <i className="fa fa-spinner fa-download" /> downloading...
                  </span>
            );

        } else if (this.props.sync_status =='sftp_connecting') {
            return (
                <span className="text-warning">
                      <i className="fa fa-spinner fa-download" /> connecting...
                  </span>
            );

        } else {
            return (
                <span className="text-info">
                     Sync <i className="fa fa-check-circle" />
                </span>
            );
        }
    }

    render() {
        const userData = reactLocalStorage.getObject('user.data');
        if(userData != null) {
            console.log(this.props.parent);
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <a className="navbar-brand text-warning" href="#">Skelet Project</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="#" onClick={this.loadProjectList}>
                                    Proyectos <span className="sr-only">(current)</span>
                                </a>
                            </li>
                        </ul>
                        <span className="mr-2">{this.syncShowStatus()}</span>
                        <form className="form-inline my-2 my-lg-0">
                           <span className="text-danger"> {userData.info.name}</span>
                        </form>
                    </div>
                </nav>
            );
        } else {
            return (
                <h2>No estamos Logueados2</h2>
            );
        }
    }
}

export default HeaderBar;
