import React, { Component } from 'react';
import './../../App.css';

const electron  = window.require('electron');
const chokidar  = electron.remote.require('chokidar');
const fs        = electron.remote.require('fs');
const { spawn } = electron.remote.require('child_process');
const exec = electron.remote.require('child_process').exec;

class ProjectSync extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            local_exist  : false,
            exist_path  : false,
            local_path  : "",
            remote_path  : "",
            remote_host  : props.project.server.host,
            remote_user  : props.project.server.user,
            remote_pass  : props.project.server.pass,
        };

        this.downloadProject = this.downloadProject.bind(this);
    }

    initSync()
    {
        let parent          = this;
        let title           = this.props.project.title;
        const local_path    = "/Users/yabafinet/PhpstormProjects/"+this.props.project.key1;
        const remote_path   = this.props.project.remote_path;

        if (local_path) {
            let watcher = chokidar.watch(local_path + '', { ignored: /^\./, persistent: true});
            watcher
                .on('add', function(path) {
                    parent.uploadProject(local_path+'/*', remote_path+'/');
                })

                .on('change', function(path) {
                    parent.uploadProject(local_path+'/*', remote_path+'/');
                })

                .on('unlink', function(path) {
                    parent.uploadProject(local_path+'/*', remote_path+'/');
                })
                .on('error', function(error) {
                    console.error(title+'/Error happened', error);
                });

            console.log("Sync->"+title+'->'+local_path);
            this.setState({exist_path: true, local_path: local_path, remote_path: remote_path});
            this.projectExistInLocal(local_path);
        }
    }

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
                //+'--progress '
                +'--stats '
                +'--exclude ".DS_Store*" '
                +'--exclude "vendor/*" '
                +' -e ssh ' +this.state.remote_user+'@'+this.state.remote_host+':'+remote_path+'/* '
                +this.state.local_path;

            console.log("Execute: "+execute_command);
            console.log("Downloading from: "+remote_path);
            console.log("Downloading in: "+this.state.local_path);

            // Report to parent:
            this.props.parent.setState({sync_status: 'downloading'});

            // CREATE LOCAL
            await exec('mkdir '+this.state.local_path,
                function(error, stdout, stderr) {
                    if (error !== null) {
                        console.error('path created: '+this.state.local_path);
                    } else { }
                }
            );

            // RSYNC FROM REMOTE SERVER
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
                        parent.props.parent.setState({sync_status: 'download'});
                    }
                });

        } else {
            console.error("No source path.");
        }
    }

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
                +'--progress '
                +'--exclude ".DS_Store*" '
                +'--exclude "vendor/*" '
                //+'--delete '
                +'--no-perms -e ssh '
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