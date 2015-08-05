This is a WordPress plugin which uses WordPress as an application server for the NarraFirma JavaScript code.
The NarraFirma application itself essentially runs in its own browser window and only uses the server to store data.
Other than the NarraFirma admin page to create journals (for projects),
there is no WordPress-specific integration of the NarraFirma application.

The major benefit of using WordPress as an application server is that it makes the NarraFirma application easier to install.
Performance for AJAX calls will likely not be as good as with the NodeJS version, but that may not matter in practice for most projects.

The WebContent directory need to be copied into the "narrafirma" directory to build an actual working plugin.
This is because most of the NarraFirma application runs as client-side JavaScript.

Because the NarraFirma application client is written in TypeScipt, 
be sure that the WebContent/js directory contains JavaScript files (*.js) built from the TypeScript source (*.ts).
This will be the case when using Eclipse with the Palantir TypeScript IDE plugin and the Eclipse project in the repository.
Alternatively, you can run "tsc" in the WebContent directory (or a parent directory).
That will use the tsconfig.json to compile the "*.ts" files.
That assumes you have the TypeScript compiler installed, which can be done using: "npm install -g typescript".

The narrafirma.php code implements a version of the Pointrel20150417 code to handle AJAX calls.
That PHP code will store messages which can add triples defining a project TripleStore.
The PHP code stores messages in the WordPress SQL database, using one table per journal.
This is different from the NodeJS version of the server, which stores messages in files with one directory per journal.
The API of both the PHP and NodeJS servers is intended to be identical, but may not yet be in practice.
