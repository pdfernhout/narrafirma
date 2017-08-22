## Installing the NarraFirma WordPress plugin

The "narrafirma" directory contains a WordPress plugin php script (narrafirma.php) which uses WordPress as an application server for the NarraFirma JavaScript code.
The NarraFirma application itself essentially runs in its own browser window as a single-page application (SPA) and only uses the server to store data.
Other than the NarraFirma admin page to create projects, there is no WordPress-specific integration of the NarraFirma application.

### Automatic build and installation

The easiest way to build the WordPress plugin is under Linux of Mac using an npm command to create "distribution/narrafirma.zip".

To do that, enter the following command on the command line in the NarraFirma project's top-level directory:

        $ npm run build-wp
        
You can then install the zip file in the usual way by uploading it to WordPress.

Depending on the zip file size and your PHP configuration,
it is possible you may see this error message when uploading or installing:
    
    > The uploaded file exceeds the upload_max_filesize directive in php.ini.
    
If you see that error related to the default 2MB PHP upload limit, and assuming the NarraFirma zip file exceeds it,
you can either [increase your PHP upload file size](https://wordpress.org/support/topic/how-to-increase-the-max-upload-size) like to 3 megabyte,
or you can unzip the files yourself directly in your WordPress plugins directory.

Here is an example of unzipping the narrafirma.zip file directly for the Mac with assuming a "_www" Apache user:

        $ cd [PathToWordPressInstall]/wordpress/wp-content/plugins
        
        $ sudo -u _www unzip [PathToNarraFirmaProject]/distribution/narrafirma.zip
        
If you are reinstalling the plugin, you may need to delete the "narrafirma" plugin directory from WordPress first before unzipping the new version.

After installing the plugin, you can then follow the directions in the section below on activating the plugin and creating your first project.  

### Manual build and installation

Alternatively, particularly under Windows which may not have command-line commands available used by build-wp
like "cp", "rm", "mkdir" and such, installing a working WordPress plugin can be done with the following manual steps:  

1. ensure the TypeScript files are compiled with the output under webapp/js,
2. copy the webapp directory to under the wordpress-plugin/narrafirma directory,
3. copy the combined files to your WordPress installation.  

After installation, you then need to activate the plugin, create your first project in the plugin's admin interface, and then use the link from the plugin's admin interface to open the application.

These manual steps are explained in more detail below.

#### Step 1: Ensure the TypeScript files are compiled to JavaScript

First, because the NarraFirma application client is written in TypeScript, 
be sure that the webapp/js directory contains JavaScript files (\*.js) built from the TypeScript source files (\*.ts).
This would be the case when using Eclipse with the Palantir TypeScript IDE plugin and the Eclipse project in the repository.
If you are not using an IDE, you can run "npm run build" from the command line in the webapp directory (or a parent directory).
That will use the tsconfig.json to compile the "*.ts" files.
That command assumes you have Node.js and npm installed first, like explained [here](https://docs.npmjs.com/getting-started/installing-node).
 If you get an error like "npm not found" you probably need to install Node.js or npm.
You will need to rerun "npm run build" after any changes to the TypeScript files (including after a git pull).

#### Step 2: Make a copy of webapp under the narrafirma directory

After you are sure the *.js files have been generated in the right place,
the webapp directory needs to be copied manually into the "narrafirma" directory to build an actual working plugin.
This is because most of the NarraFirma application runs as client-side JavaScript.
Alternatively, to make a symbolic link for that directory, from wordpress-plugin/narrafirma do:

        $ ln -s ../../webapp/ webapp
        
The symbolic file was not checked in because it still seems to cause potential issues with older git clients.
This file (or copied directory) will be ignored based on a .gitignore file in the wordpress-plugin directory.

#### Step 3: Copy the files to your WordPress installation

After you have done the previous two steps, setting the files into WordPress can be done either by copying them,
symbolically linking from the WordPress plugin directory to the source code,
or by making them into a zip file and extracting them.

If you copied the webapp directory under narrafirma, then it should be straightforward to copy all that
to the WordPress' wordpress-plugin directory using a standard copy command.
You would need to be sure the copied files have permissions or a owner such that they can be read by your web server.

The following rsync command may be useful when testing the WordPress plugin if you have set up a symbolic link in the narrafirma directory to the webapp directory.
You would need to replace "_www" with whatever your web server needs as a user for permissions.

        $ pwd
        
            [PathToWordPress]/wp-content/plugins
            
        $ mkdir narrafirma
        
        $ sudo -u _www rsync -r --copy-links [PathToNarraFirmaProject]/wordpress-plugin/narrafirma/* narrafirma

Make sure you are running rsync as a user who has appropriate permissions to create files readable by your web server -- or alternatively you may need to use chown or chmod to make the files readabel by your web server.

You can instead create a symbolic link to the narrafirma directory from your wordpress-plugin directory.
That requires you to have configured your web server to follow symbolic links
and also that the file permissions permit the server to read those files.

If your install is on another system computer, making a zip file may be the best option.
To do this, cd into the "wordpress-plugin" directory and run:

        $ zip -r narrafirma.zip narrafirma
        
You can then copy "narrafirma.zip" to WordPress' wordpress-plugin directory and extract it.

### Activate the plugin and create your first project

After any of these approaches, you would then need to activate the plugin within the WordPress admin interface.
Once the plugin is activated, it will create a new menu item called "NarraFirma" at the top level of the WordPress admin menu.

You can then navigate to the NarraFirma menu and use the page there to create your first project. You will need to set the permissions on the new project on that page to allow specific roles or user IDs to edit the project.

To run the NarraFirma application itself, click on the application link on the plugin's admin interface.

#### Other information

The narrafirma.php code implements a version of the Pointrel20150417 code to handle AJAX calls.
That PHP code will store messages which can add triples defining a project TripleStore.
The PHP code stores messages in the WordPress SQL database, using one table per journal.
This is different from the NodeJS version of the server, which stores messages in files with one directory per journal.
The API of both the PHP and NodeJS servers is intended to be identical, but may not yet be in practice.

The major benefit of using WordPress as an application server is that it makes the NarraFirma application easier to install.
Performance for AJAX calls will likely not be as good as with the NodeJS version, but that may not matter in practice for most projects.
