import React, { Component } from 'react';
import logo from './../../logo.svg';
import './../../App.css';

const {app} = window.require('electron').remote;

class DeveloperDashBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }

        this.setUser = this.setUser.bind(this)
    }

    setUser(userData) {
        this.setState({ user:userData })
    }

    render() {
        console.log("log: "+this.state);
        if(this.state.user != null) {
            return (
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h2>Developer Dashboard</h2>
                    </div>
                    <p className="App-intro">
                        <b> Release 0.2.7 </b>
                        Version: {app.getVersion()}
                    </p>
                </div>
            );
        } else {
            return (
                <h2>No estamos Logueados2</h2>
            );
        }
    }
}

export default DeveloperDashBoard;
