# Setting up NarraFirma on your local computer from source

## Installing with WordPress

To run NarraFirma using an existing WordPress installation:

- Build the NarraFirma plugin zip file from source by using "npm run build-wp". The resulting file will be "distribution/narrafirma.zip".
- Go to your WordPress site (in your browser). Choose the Plugins tab on the Dashboard menu (on the left). Click Add New, then Upload Plugin. Choose the zip file you built. Click Install. Then click Activate Plugin.
- Click on the new NarraFirma menu item in the Dashboard menu. Create a project in the NarraFirma plugin screen, and specify which WordPress users should have read and/or write permissions for the project. (Remember to click Save changes after you create the new project.)

## Installing with Node.js

To run NarraFirma with an existing Node.js installation:

- Compile the TypeScript files. To do this, run "npm run build" from the command line in the top level project directory. That will use the tsconfig.json to compile the “*.ts” files. You will need to rerun “npm run build” after any changes to the TypeScript files (including after a git pull) before restarting the server. You could also configure an IDE to compile TypeScript for you.
- Go to the server directory in the unzipped files, and read the directions in the file readme_server.txt about how to start the server.
- Before you start the NarraFirma server for the first time, you will need to set the superuser password using a command-line tool. On a command line, type node admin.js. Within that command-line tool, use the update-superuser command.
- After you have set up the superuser password, start the NarraFirma server (using the directions in readme_server.txt), and connect to it using your web browser.
- Login to NarraFirma as superuser and create your first project using the NarraFirma administration tool. You can create other users and give them permissions in your project.
- After that, you can log out as superuser, log back in as a different user (whom you gave permission for the project), and start using NarraFirma.
