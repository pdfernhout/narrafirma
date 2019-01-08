To use the server for testing;

Install node.js

To run, cd to this directory and type:

$ node NarraFirmaServer.js

You may want to increase the Javascript heap size by calling node in this way:

$ node --max-old-space-size=8192 NarraFirmaServer.js

To have server restart when making code changes, first install "supervisor":

$ npm install -g supervisor

After that, you can run this which will restart the server when the source changes to the server file:

$ supervisor NarraFirmaServer.js


