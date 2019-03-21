import {reactLocalStorage} from "reactjs-localstorage";
let userData = reactLocalStorage.getObject('user.data');

export function refreshUserData()
{
    userData = reactLocalStorage.getObject('user.data');
    return userData;
}

export function getUserToken()
{
    if (! userData.token) {
        userData = refreshUserData();
    }
    return userData.token;
}

export function getUsername()
{
    if (! userData.username) {
        userData = refreshUserData();
    }

    return userData.username;
}