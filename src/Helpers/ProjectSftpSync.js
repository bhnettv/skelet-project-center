import {reactLocalStorage} from "reactjs-localstorage";
const electron  = window.require('electron');

// SFTP:
const Client = electron.remote.require('ssh2-sftp-client');
const app    = electron.remote.app;

let localInfo           = {};
let local_projects_path = app.getPath('home')+ "/PhpstormProjects";

/**
 *
 * @param project_key
 * @returns {*}
 */
export function getProjectLocalInfo(project_key)
{
    localInfo = reactLocalStorage.getObject('project.'+project_key);
    return localInfo;
}

/**
 *
 * @param project_key
 */
function connectSftp(project_key)
{
    let projectInfo = getProjectLocalInfo(project_key);

    // Report to sync-status:
    //this.props.parent.setState({sync_status: 'sftp_connecting'});

    // SFTP:
    const sftp = new Client();
    sftp.connect({
        host    : projectInfo.server.host+'',
        port    : 22,
        username: projectInfo.server.user+'',
        password: projectInfo.server.pass+''
    }).then(() => {
        //console.log(sftp.list(path));
        //return sftp.list(path);
    }).then((data) => {
        //console.log(data, 'the data info');
    }).catch((err) => {
        //console.log(err, 'sftp error!');
    });

    sftp.on('error', function (e) {
        //console.log('sftp error!', e);
    });

    return sftp;
}

/**
 *
 * @param project_key
 * @param remote_file
 */
export function getRemoteFile(project_key, remote_file)
{
    let projectInfo = getProjectLocalInfo(project_key);
    let sftp        = connectSftp(project_key);

    sftp.on('ready', function (e) {
        console.log(e, 'getRemoteFile / Connected.');
        // Report to sync-status:
        //parent.props.parent.setState({sync_status: 'sftp_connected'});

        let fileLocal   = getLocalPathFromRemotePath(remote_file, projectInfo);
        let fileRemote  = remote_file;
        // sftp.get(fileRemote, fileLocal, function(fastGetErr) {
        //     if (fastGetErr) {
        //         console.log("getRemoteFile Error: ", fastGetErr);
        //     } else {
        //         console.log("File transfer of file " + fileRemote + " succeeded");
        //     }
        // });
        //
        // sftp.on('error', function (e) {
        //     console.log('getRemoteFile / Error', e);
        // });

        sftp.list(projectInfo.remote_path);

        console.log("GET: \nlocal: "+fileLocal+" \nremote: "+fileRemote);
    });
}

/**
 *
 * @param file_path
 * @param projectInfo
 * @returns {string}
 */
export function getLocalPathFromRemotePath(file_path, projectInfo)
{
    let root        = projectInfo.remote_path;
    let filename    = file_path.replace(root, '');
    let remotePath  = local_projects_path+""+filename;

    return remotePath;
}