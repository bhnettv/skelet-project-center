import {reactLocalStorage} from "reactjs-localstorage";
const userData = reactLocalStorage.getObject('user.data');

export function getUserToken() {
    return userData.token;
}

export function getUsername() {
    return userData.username;
}