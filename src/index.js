import React from 'react';
import ReactDOM from 'react-dom';
//import App from './App';
//import Login from './Components/Login/Login';
import './index.css';
import SectionsManager from "./Components/SectionsManager";
import Login from "./Components/Login/Login";

ReactDOM.render(<SectionsManager section="login"/>, document.getElementById('root'));