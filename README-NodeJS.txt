Installing NarraFirma with Node.js

To run NarraFirma with an existing Node.js installation:

1. Download the entire NarraFirma source file (narrafirma.zip) from the NarraFirma GitHub releases page:
https://github.com/pdfernhout/narrafirma/releases

2. Unzip the narrafirma.zip file.

3. Compile the TypeScript files. To do this, run tsc from the command line in the top level project directory. 
That will use the tsconfig.json to compile the "*.ts" files. You will need to rerun "tsc" after any changes to the 
TypeScript files (including after a git pull). 

The "tsc" TypeScript compiler can be installed using: "npm install -g typescript".
    
4. Go to the server directory in the unzipped files, and read the directions in the file readme_server.txt 
about how to start the server.

5. Before you start the NarraFirma server for the first time, you will need to set the 
superuser password using a command-line tool. On a command line, type node admin.js. 
Within that command-line tool, use the update-superuser command.

6. After you have set up the superuser password, start the NarraFirma server 
(using the directions in readme_server.txt), and connect to it using your web browser.

7. Login to NarraFirma as superuser and create your first project using the NarraFirma administration tool. 
You can create other users and give them permissions in your project.

8. After that, you can log out as superuser, log back in as a different user 
(whom you gave permission for the project), and start using NarraFirma.

These instructions were copied from:
https://narrafirma.com/home/setting-up-narrafirma-on-your-local-computer

The instructions there might be more up to date than these.