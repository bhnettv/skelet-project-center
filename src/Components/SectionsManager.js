import React, { Component } from 'react';
import '../App.css';
import './../css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import HeaderBar from "./HeaderBar";
import DeveloperDashBoard from "./Dashboards/DeveloperDashBoard";
import Login from "./Login/Login";
import Loading from "./ShowMessage";
import InitConfigurations from "./InitConfigurations";

class SectionsManager extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projects        : [],
            section         : "login",
            section_loading : false,
            component1      : null,
            user            : null,
            sync_get_files  : null,
        };

        this.loadSection    = this.loadSection.bind(this);
        this.loadComponent1 = this.loadComponent1.bind(this);
        this.setUser        = this.setUser.bind(this);
    }

    componentWillMount() {
        this.setState({ section: 'login', section_loading: true });
    }

    componentDidMount() {
        //this.setState({ section: 'login' });
    }

    loadSection(section_name) {
        //this.setState({ section_loading: true });
        console.log("*load section: "+this.state.section);
        this.setState({ section_loading: true, section: section_name });
    }

    loadComponent1(component) {
        console.log("*load component: "+component.toString());
        this.setState({ component1: component, section:'' });
    }

    setUser(user) {
        this.setState({ user: user });
    }

    getUser()
    {
        return this.state.user;
    }

    render()
    {
        console.log("sync status: "+this.state.sync_status);

        const MainHeader = (
            <HeaderBar parent={this} sync_status={this.state.sync_status}/>
        );

        let section;

        if (! this.state.section_loading) {

            return (<Loading />);

        } else  if (this.state.section == 'login') {
            return (
                <div className="App">
                    <Login parent={this} setUser={this.getUser()} />
                </div>
            );
        } else  if (this.state.section == 'config') {
            return (
                <div className="App">
                    <InitConfigurations />
                </div>
            );
        } else if (this.state.section == 'dashboard_dev') {
            section = ( <DeveloperDashBoard parent={this} /> );

        } else if (this.state.component1 !=null) {
            section = ( this.state.component1 );
        }

        return (
            <div className="App container p-2 bd-highlight">
                {MainHeader}
                <div className="App-section p-2 bd-highlight">
                    {section}
                </div>
            </div>
        );

        //console.log("logging user: "+this.state.user.name);
    }
}

export default SectionsManager;