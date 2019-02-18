import {reactLocalStorage} from "reactjs-localstorage";
const electron  = window.require('electron');
const exec = electron.remote.require('child_process').exec;

export function getProjectLocalInfo(project_key)
{
    let localInfo = reactLocalStorage.getObject('project.'+project_key);
    return localInfo;
}

export function syncFromRemoteServer(project_key)
{
    let projectInfo = getProjectLocalInfo(project_key);

    if (projectInfo.local_path) {

        const command = 'sshpass -p '+projectInfo.server.pass+' '
            +'rsync --progress --exclude ".git/*" --delete -avz -e ssh '
            +projectInfo.server.user+'@'+projectInfo.server.host+':'+projectInfo.remote_path+'/* '
            +projectInfo.local_path;

        console.log("-->"+command);
        console.log("sync from server: "+projectInfo.local_path);
        const { stdout, stderr } = exec(
            command,
            function(error, stdout, stderr) {

                console.log('upload-stdout: ' + stdout);
                if (error !== null) {
                    console.error('upload-error: ' + error);
                } else {
                    //parent.projectExistInLocal();
                }
            });

    } else {
        console.error("No source path.");
    }
}