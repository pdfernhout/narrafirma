// Test at: http://localhost:8080/pointrel/pointrel-app/
/*jslint node: true */
"use strict";

// Standard nodejs modules

var fs = require('fs');
var http = require('http');
var https = require('https');

// The modules below require npm installation
var express = require('express');
var bodyParser = require('body-parser');

// the server library
var pointrelServer = require("./pointrel20150417/pointrelServer");

var accessControl = require("./accessControl");
accessControl.initialize();

// TODO: Need better loading and project management than this
// pointrelServer.addJournalSync("testing");
pointrelServer.addJournalSync("NarraFirma-administration");
// TODO: Copying config data from Pointrel module
var journalDirectory = "../server-data/" + "journals/";
var fileNames;
try {
    fileNames = fs.readdirSync(journalDirectory);
} catch (error) {
    console.log("Problem reading directory %s error: %s", journalDirectory, error);
}
for (var fileNameIndex = 0; fileNameIndex < fileNames.length; fileNameIndex++) {
    var fileName = fileNames[fileNameIndex];
    if (fileName.charAt(0) === ".") continue;
    var stat = fs.statSync(journalDirectory + fileName);
    if (stat.isDirectory()) {
        console.log("Adding journal: ", fileName);
        pointrelServer.addJournalSync(fileName);
    }
}
pointrelServer.indexAllJournals();

// For authentication
var authentication = require("./authentication");

// This can be used to stub out the passport authentication:
/*
    var authentication = {
    initialize: function () {return true;},
    ensureAuthenticated: function (request, response, next) { return next(); }
};
*/

// TODO: think about authentication
var config = {
    requireAuthentication: true
};

// Main code

function applicationLog() {
    var newArguments = [new Date().toISOString()].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, newArguments);
}

applicationLog("================== PNIWorkbookServer server for nodejs started ================");

applicationLog("__dirname", __dirname);

var app = express();

var logger = function(request, response, next) {
    applicationLog("Request:", request.method, request.url);
    next();
};

app.use(logger);

// TODO: Could there be an issue with bodyParser with undeleted temp files? (Mentioned somewhere online)
// includes support to parse JSON-encoded bodies (and saving the rawBody)
app.use(bodyParser.json({
    limit: '10mb'
}));

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// Application routes

// TODO: Fix this
app.post("/survey/questions/:surveyID", function (request, response) {
    applicationLog("ERROR TODO UNFINISHED");
    return response.json({status: "FAILED", message: "Unfinished", questions: null});
});

/*
TODO: Delete this. Just kept temporarily for reference when finishing the above function
app.post("/survey/questions/:surveyID", function (request, response) {
    var surveyID = request.params.surveyID;
    var indexEntries = pointrel20141201Server.referencesForTag(surveyID);
    if (!indexEntries) {
        return response.json({status: "FAILED", message: "Survey is not defined", questions: null});
    }
    var indexEntry = getLatestIndexEntry(indexEntries);
    if (!indexEntry) {
        var errorMessage = "Survey definitions are missing timestamps";
        applicationLog("ERROR: Should never get here", errorMessage);
        return response.json({status: "FAILED", message: errorMessage, questions: null});
    }
    pointrel20141201Server.fetchContentForReference(indexEntry.sha256AndLength, function(error, data) {
        if (error) {
            applicationLog("ERROR reading question file: ", error);
            return response.json({status: "FAILED", message: error, questions: null});
        }
        var questionsEnvelope;
        try {
            questionsEnvelope = JSON.parse(data);
        } catch (parseError) {
            return response.json({status: "FAILED", message: "Parse error: " + parseError, questions: null});
        }
        // TODO: Should this really have to parse the question object? Maybe should let client do it?
        return response.json({status: "OK", message: "Retrieved survey", questions: questionsEnvelope.content});
    });
});
*/

// Set up authentication routes and config
authentication.initialize(app, config);

app.post("/api/pointrel20150417", authentication.ensureAuthenticatedForJSON, function(request, response) {
    // response.json({"error": "server unfinished!"});
    // TODO: Exception handling?
    if (request.user) {
        // Passport thinks we are authenticated... ???
    }
    pointrelServer.processRequest(request.body, function(requestResultMessage) {
        response.json(requestResultMessage);
    }, request);
});

app.use("/$", authentication.ensureAuthenticated, function(req, res) {
    res.redirect('/index.html');
});

app.use("/", authentication.ensureAuthenticated, express.static(__dirname + "/../WebContent"));

// TODO: For developer testing only; remove in final version
app.use("/dojo-debug", express.static(__dirname + "/../../PNIWorkbookLibraries/dojo-release-1.10.4-src"));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Create an HTTP service.
var server = http.createServer(app).listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  applicationLog("PNIWorkbookServer app listening at http://%s:%s", host, port);
});

// http://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js

// TODO: These keys are only for testing; do not use in production!!!!
var sslOptions = {
    key: fs.readFileSync('test-ssl-info/pointrel-test-key.pem'),
    cert: fs.readFileSync('test-ssl-info/pointrel-test-cert.pem')
};

//Create an HTTPS service identical to the HTTP service.
var server2 = https.createServer(sslOptions, app).listen(8081, function () {
  var host = server2.address().address;
  var port = server2.address().port;
  applicationLog("PNIWorkbookServer app listening at https://%s:%s", host, port);
});

