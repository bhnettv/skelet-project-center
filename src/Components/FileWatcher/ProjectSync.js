import React, { Component } from 'react';
import './../../App.css';
import {downloadFromRemoteServer} from "../../Helpers/ProjectLocalInfo";
import {skeletProjectWorkspacePath} from "../../Helpers/LocalConfig";

const electron  = window.require('electron');
const app       = electron.remote.app;
const chokidar  = electron.remote.require('chokidar');
const fs        = electron.remote.require('fs');
const { spawn } = electron.remote.require('child_process');
const exec      = electron.remote.require('child_process').exec;

// SFTP:
const Client = electron.remote.require('ssh2-sftp-client');

class ProjectSync extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            local_exist  : false,
            exist_path   : false,
            local_path   : "",
            remote_path  : "",
            remote_host  : props.project.server.host,
            remote_user  : props.project.server.user,
            remote_pass  : props.project.server.pass,
        };

        this.downloadProject = this.downloadProject.bind(this);
        this.fastPut         = this.fastPut.bind(this);
    }

    /**
     *
     * @param path
     */
    connectSftp(path)
    {
        // Report to sync-status:
        this.props.parent.setState({sync_status: 'sftp_connecting'});

        // SFTP:
        const sftp = new Client();
        sftp.connect({
            host: this.state.remote_host+'',
            port: 22,
            username: this.state.remote_user+'',
            password: this.state.remote_pass+''
        }).then(() => {
            //console.log(sftp.list(path));
            return sftp.list(path);
        }).then((data) => {
            //console.log(data, 'the data info');
        }).catch((err) => {
            console.log(err, 'catch error');
        });

        sftp.on('error', function (e) {
            console.log(e, 'catch error 3');
        });

        return sftp;
    }

    initSync()
    {
        let parent          = this;
        let title           = this.props.project.title;
        const local_path    = skeletProjectWorkspacePath()+"/"+this.props.project.key1;
        const remote_path   = this.props.project.remote_path;
        let sftp            = parent.connectSftp(remote_path);
        parent.projectExistInLocal(local_path+'/composer.json');

        sftp.on('ready', function (e) {
            console.log(e, 'sftp ready!!');
            // Report to sync-status:
            parent.props.parent.setState({sync_status: 'sftp_connected'});

            if (local_path) {
                let watcher = chokidar.watch(local_path + '', {
                    ignored: ['*.log', 'vendor/*', '*.idea', '*.DS_Store'],
                    persistent: true,
                    ignoreInitial: true,
                });
                watcher
                    .on('add', function(path) {
                        let fileLocal   = path;
                        let fileRemote  = parent.getFileRemotePath(path);
                        parent.fastPut(sftp, fileLocal, fileRemote);
                        console.log("watcher-add: "+fileLocal);

                    })

                    .on('change', function(path) {
                        let fileLocal   = path;
                        let fileRemote  = parent.getFileRemotePath(path);
                        parent.fastPut(sftp, fileLocal, fileRemote);
                        console.log("watcher-change: "+fileLocal);

                    })

                    .on('unlink', function(path) {
                        //let fileLocal   = path;
                        let fileRemote  = parent.getFileRemotePath(path);
                        sftp.delete(fileRemote);
                        console.log("DELETE: \nremote: "+fileRemote);

                    })
                    .on('error', function(error) {
                        console.error(title+'/Error happened', error);
                    });

                console.log("Sync->"+title+'->'+local_path);
                parent.setState({exist_path: true, local_path: local_path, remote_path: remote_path});
            }
        });
    }

    /**
     *
     * @param sftp
     * @param fileLocal
     * @param fileRemote
     */
    fastPut(sftp, fileLocal, fileRemote)
    {
        // Verificar si el estado de la sincronización
        // es descargando el proyecto.
        if (this.props.parent.state.sync_status =='downloading') {
            return;
        }

        console.log("[PUT]: \nlocal: "+fileLocal+" \nremote: "+fileRemote);
        sftp.fastPut(fileLocal, fileRemote);
    }

    /**
     *
     * @param path
     */
    projectExistInLocal(path = null)
    {
        if (fs.existsSync(path)) {
            this.setState({local_exist: true});
            console.info("Exist: "+this.state.local_path)
        } else {
            console.error("Not Exist: "+this.state.local_path)
        }
    }

    async downloadProject()
    {
        let parent =  this;
        if (this.state.exist_path && this.state.local_path) {

            const remote_path = this.state.remote_path;
            const execute_command =
                'sshpass -p '+this.state.remote_pass+' '
                +'rsync -avz '
                +'--stats '
                +'--exclude ".DS_Store*" '
                +'--exclude ".git/*" '
                +'--include ".*" '
                +' -e ssh ' +this.state.remote_user+'@'+this.state.remote_host+':'+remote_path+'/* '
                +this.state.local_path
                +' | grep "Number of files" '
            ;

            console.log("Execute: "+execute_command);
            console.log("Downloading from: "+remote_path);
            console.log("Downloading in: "+this.state.local_path);

            // Report to parent:
            this.props.parent.setState({sync_status: 'downloading'});

            // CREATE LOCAL
            await exec('mkdir '+this.state.local_path,
                function(error, stdout, stderr) {
                    if (error !== null) {
                        console.error('path created: '+parent.state.local_path);
                    } else { }
                }
            );

            const { stdout, stderr } = await exec(
                execute_command,
                function(error, stdout, stderr) {
                    console.log('download-stdout: ' + stdout);
                    parent.projectExistInLocal();

                    if (error !== null) {
                        console.error('download-error: ' + error);
                    } else {
                        //parent.projectExistInLocal();
                    }

                    if(stdout.search("Number of files:") > -1) {
                        console.log("download complete: "+stdout.search("Number of files:"));
                        //parent.props.parent.setState({sync_status: 'download'});

                        downloadFromRemoteServer(parent.props.project.key1,'.env', function (resp) {
                            parent.props.parent.setState({sync_status: 'synchronized'});
                        });
                    }
                });

        } else {
            console.error("No source path.");
        }
    }

    /**
     *
     * @param local
     * @param remote
     * @returns {Promise<void>}
     */
    async uploadProject(local, remote)
    {
        let parent = this;

        // Verificar si el estado de la sincronizacion
        // es descargando el proyecto.
        if (parent.props.parent.state =='downloading') {
            return;
        }

        this.props.parent.setState({sync_status: 'uploading'});

        if (this.state.exist_path && this.state.local_path) {

            const command = 'sshpass -p '+this.state.remote_pass+' '
                +'rsync -avz '
                //+'--no-group '
                //+'--no-owner '
                //+'--progress '
                +'--exclude ".DS_Store*" '
                +'--exclude "vendor/*" '
                //+'--delete '
                +'-e ssh '
                +local +' ' +this.state.remote_user+'@'+this.state.remote_host+':'+remote;

            console.log("-->"+command);
            console.log("uploading in: "+local);
            const { stdout, stderr } = await exec(
                command
                ,
                function(error, stdout, stderr) {

                    console.log('upload-stdout: ' + stdout);
                    if (error !== null) {
                        console.error('upload-error: ' + error);
                    } else {
                        //parent.projectExistInLocal();
                    }

                    parent.props.parent.setState({sync_status: 'upload'});
                });

        } else {
            console.error("No source path.");
        }
    }

    componentDidMount() {
        this.initSync();
    }

    /**
     *
     * @param file_path
     * @returns {string}
     */
    getFileRemotePath(file_path)
    {
        let root        = this.state.local_path;
        let filename    = file_path.replace(root, '');
        let remotePath  = this.props.project.remote_path;

        return remotePath+''+filename;
    }

    render() {
        let button = (
            <a href="#" className="btn btn-light">
                <i className="fa fa-server"></i>
            </a>
        );

        if (! this.state.local_exist) {
            button = (
                <a href="#" className="btn btn-light" onClick={this.downloadProject}>
                    <i className="fa fa-arrow-circle-down"></i>
                </a>
            );
        }

        return (
            <span>
                {button}
            </span>
        );
    }
}

export default ProjectSync;