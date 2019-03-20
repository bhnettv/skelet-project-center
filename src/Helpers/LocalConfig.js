import {reactLocalStorage} from "reactjs-localstorage";
const config    = reactLocalStorage.getObject('config');
const electron  = window.require('electron');
const app       = electron.remote.app;

export function configGetHost()
{
    return config.host;
}

export function skeletProjectWorkspacePath() {
    return app.getPath('home') + "/SkeletProjects";
}