import {getProjectLocalInfo} from "./ProjectLocalInfo";
import {skeletProjectWorkspacePath} from "./LocalConfig";
const electron  = window.require('electron');
const exec = electron.remote.require('child_process').exec;

/**
 * Abre un archivo local desde una referencia remota.
 *  Normalmente este archivo se abrirá en el IDE
 *
 * @param project_key
 * @param file_remote
 * @returns {string}
 */
export function skeletOpenFileFromRemote(project_key, file_remote)
{
    let projectInfo      = getProjectLocalInfo(project_key);
    let remote_path      = projectInfo.remote_path;
    let file_local       = file_remote.replace(remote_path,'');
    let projectLocalPath = skeletProjectWorkspacePath() + "/" + project_key;
    file_local           = projectLocalPath + "/" + file_local;

    exec('pstorm '+file_local,
        function(error, stdout, stderr) {
            if (error !== null) {
                console.error(stderr);
            } else { }
        }
    );

    return "";
}