This is a WordPress plugin which uses WordPress as an application server for the NarraFirma JavaScript code.
The NarraFirma application itself essentially runs in its own browser window and only uses the server to store data.
Other than the NarraFirma admin page to create journals (for projects),
there is no WordPress-specific integration of the NarraFirma application.

Until the plugin build process is improved, installing a working WordPress plugin currently requires these manual steps:
1. ensure the TypeScript files are compiled with the output under WebContent/js,
2. copy the WebContent directory to under the wordpress-plugin/narrafirma directory,
3. copy the combined files to your WordPress installation.
You then need to activate the plugin and create your first project in the plugin's admin interface.

== Step 1: Ensuring the TypeScript files are compiled to JavaScript

First, because the NarraFirma application client is written in TypeScript, 
be sure that the WebContent/js directory contains JavaScript files (*.js) built from the TypeScript source (*.ts).
This will be the case when using Eclipse with the Palantir TypeScript IDE plugin and the Eclipse project in the repository.
Alternatively, you can run "tsc" in the WebContent directory (or a parent directory).
That will use the tsconfig.json to compile the "*.ts" files.
That assumes you have the TypeScript compiler installed, which can be done using: "npm install -g typescript".
You will need to rerun "tsc" after any changes to the TypeScript files (including after a git pull).

== Step 2: Getting a copy of WebContent under the narrafirma directory

After you are sure the *.js files have been generated in the right place,
the WebContent directory needs to be copied manually into the "narrafirma" directory to build an actual working plugin.
This is because most of the NarraFirma application runs as client-side JavaScript.
Alternatively, to make a symbolic link for that directory, from wordpress-plugin/narrafirma do:
    ln -s ../../WebContent/ WebContent
The symbolic file was not checked in because it still seems to cause potential issues with older git clients.
This file (or copied directory) will be ignored based on a .gitignore file in the wordpress-plugin directory.

== Step 3: Getting the files into a WordPress installation

After you have doen the previus two steps, setting the files into WordPress can be done either by copying them,
symbolicly linking from the WordPress plugin direcotry to the source code,
or by making them into a zip file and extracting them.

If you copied the WebContent directory under nararfirma, then it should be straighforward to copy all that
to the WordPress' wordpress-plugin directory using a stanadard copy command.
You would need to be sure the copied files have permissions or a owner such that they can be read by your web server.

The following rsync command may be useful when testing the WordPress plugin if you have set up a symbolic link in the narrafirma directory to the WebContent directory.
    $ pwd
        [$WORDPRESS_PATH]/wp-content/plugins
    $ mkdir narrafirma
    $ rsync -r --copy-links [$REPOSITORY_PATH]/wordpress-plugin/narrafirma/* narrafirma
Make sure you are running rsync as a user who has appropriate permissions to create files readable by your web server -- or alternatively you may need to use chown or chmod to make the files readabel by your web server.

You can instead create a symbolic link to the narrafirma directory from your wordpress-plugin directory.
That requires you to have configured your web server to follow symbolic links
and also that the file permissions permit the server to read those files.

If your install is on another system computer, making a zip file may be the best option.
To do this, cd into the "wordpress-plugin" directory and run:  
    $ zip -r narrafirma.zip narrafirma
You can then copy "narrafirma.zip" to WordPress' wordpress-plugin directory and extract it.

== Step 4: Activating the plugin and creatign your first project

After any of these approaches, you would then need to activate the plugin within the WordPress admin interface.
Once the plugin is activated, it will create a new menu item called "NarraFirma" at the top level of the WordPress admin menu.
You can then navigate to the NarraFirma menu and use the page there to create your first project.
You will need to set the permissions on the new project on that page to allow specific roles or user IDs to edit the project.

== Other information

The narrafirma.php code implements a version of the Pointrel20150417 code to handle AJAX calls.
That PHP code will store messages which can add triples defining a project TripleStore.
The PHP code stores messages in the WordPress SQL database, using one table per journal.
This is different from the NodeJS version of the server, which stores messages in files with one directory per journal.
The API of both the PHP and NodeJS servers is intended to be identical, but may not yet be in practice.

The major benefit of using WordPress as an application server is that it makes the NarraFirma application easier to install.
Performance for AJAX calls will likely not be as good as with the NodeJS version, but that may not matter in practice for most projects.
