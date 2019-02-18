import './../../App.css';
import React, { Component } from 'react';
import {reactLocalStorage}  from 'reactjs-localstorage';
import ProjectsManager      from "../Projects/ProjectsManager";
const {app} = window.require('electron').remote;

class DeveloperDashBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    setUser(userData) {
        this.setState({ user:userData })
    }

    render() {
        const userData = reactLocalStorage.getObject('user.data');
        if(userData != null) {
            return (
                <ProjectsManager parent={this.props.parent} />
            );
        } else {
            return (
                <h2>No estamos Logueados2</h2>
            );
        }
    }
}

export default DeveloperDashBoard;
