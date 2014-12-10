/*jslint node: true */
"use strict";

/**
 * File to start using forever, logs crashes, restarts on file changes, etc.
 * From: http://stackoverflow.com/questions/25084368/how-do-i-use-forever-with-express-to-keep-a-nodejs-server-running
 */

var cmd = ( process.env.DBG ? "../../node-v0.10.33-linux-x64/bin/node --debug" : "../../node-v0.10.33-linux-x64/bin/node" );

var forever = require( 'forever' ),
  //exec = require('child_process').exec,
  child = new( forever.Monitor )( 'PNIWorkbookServer.js', {
    'silent': false,
    'pidFile': '../pids/node-app.pid',
    'watch': false,
    'command': cmd,
    'append': true,
    // "max" : 10,
    'watchDirectory': '.', // Top-level directory to watch from.
    'watchIgnoreDotFiles': true, // whether to ignore dot files
    'watchIgnorePatterns': [], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
    'logFile': '../logs/forever.log', // Path to log output from forever process (when daemonized)
    'outFile': '../logs/forever.out', // Path to log output from child stdout
    'errFile': '../logs/forever.err'
  } );

child.on( "exit", function() {
  console.log( 'node-app has exited!' );
} );
child.on( "restart", function() {
  console.log( 'node-app has restarted.' );
} );


child.start();
forever.startServer( child );

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down \'node forever\' from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit();
} );

process.on( 'exit', function() {
  console.log( 'About to exit \'node forever\' process.' );
} );

process.on( 'uncaughtException', function( err ) {
  console.log( 'Caught exception in \'node forever\': ' + err );
} );
