import React, { Component } from 'react';
import './../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import DeveloperDashBoard from "../Dashboards/DeveloperDashBoard";

const {app} = window.require('electron').remote;

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }

        this.setUser = this.setUser.bind(this);
        this.logUser = this.logUser.bind(this);
    }

    setUser(userData) {
        this.setState({ user: userData })

    }

    logUser() {
        //const email = document.getElementsByClassName('the_email')[0].value;
        //const pass  = document.getElementsByClassName('the_pass')[0].value;
        const userData = {
            id: 213,
            name: "Yadel Batista"
        };
        this.setState({ user: userData })
        //this.setUser(userData);
    }

    render() {
        if(this.state.user == null) {
            return (
                <div className="App">
                    <form className="px-4 py-3">
                        <div className="form-group">
                            <label htmlFor="exampleDropdownFormEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleDropdownFormEmail1"
                                   placeholder="email@example.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleDropdownFormPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleDropdownFormPassword1"
                                   placeholder="Password" />
                        </div>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="dropdownCheck"/>
                                <label className="form-check-label" htmlFor="dropdownCheck">
                                    Remember me
                                </label>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={this.logUser}>Sign in</button>
                    </form>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">New around here? Sign up</a>
                    <a className="dropdown-item" href="#">Forgot password?</a>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <DeveloperDashBoard setUser={this.state.user} />
                </div>
            );
        }
    }
}

export default Login;
