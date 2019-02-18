import {reactLocalStorage} from "reactjs-localstorage";
const config = reactLocalStorage.getObject('config');

export function configGetHost()
{
    return config.host;
}