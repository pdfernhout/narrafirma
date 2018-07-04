Installing NarraFirma with Node.js

To run NarraFirma with an existing Node.js installation:

1. Download the entire NarraFirma source file (narrafirma.zip) from the NarraFirma GitHub releases page:
https://github.com/pdfernhout/narrafirma/releases

2. Unzip the narrafirma.zip file.

3. Compile the TypeScript files. To do this, run "npm run build" from the command line in the directory where you unzipped the NarraFirma files. 
This will use the tsconfig.json to compile the "*.ts" files. 
- If you get an error like "npm not found" you probably need to install Node.js or npm.
- If you get an error like "tsc not recognized" you need to install typescript using the commmand "npm install typescript -g".

Note that you will need to rerun "npm run build" each time you make changes to the TypeScript files (including after a git pull). 

4. Before you start the NarraFirma server for the first time, you will need to set the 
superuser password using a command-line tool. On a command line, type "node admin.js". 
Within that command-line tool, use the update-superuser command to add a password to the built-in superuser account.

5. Next go to the server directory in your unzipped files and read the directions in the file readme_server.txt 
about how to start the server. Connect to the server using your web browser.

6. Log in to NarraFirma as superuser and create your first project using the NarraFirma administration tool. 
You can create other users and give them passwords and permissions in your project. (We suggest you keep the "superuser"
for server administration and use another account to work on projects.)

7. After that, you can log out as superuser, log back in as a different user 
(whom you gave permission for the project), and start using NarraFirma.

These instructions were copied from:
https://narrafirma.com/home/setting-up-narrafirma/

The instructions there might be more up to date than these.
