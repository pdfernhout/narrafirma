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
// Authentication-related
var passport = require("passport");
var passportLocal = require("passport-local");
var flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var sessionModule = require("express-session");

// the server library
var pointrel20141201Server = require("./pointrel20141201Server");

// TODO: think about authentication
var config = {
    requireAuthentication: false
};

// For authentication test; see: https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js
var LocalStrategy = passportLocal.Strategy;
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, callback) {
    var idx = id - 1;
    if (users[idx]) {
        callback(null, users[idx]);
    } else {
        callback(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, callback) {
  for (var i in users) { 
    var user = users[i];
    if (user.username === username) {
      return callback(null, user);
    }
  }
  return callback(null, null);
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

function ensureAuthenticated(request, response, next) {
  if (!config.requireAuthentication || request.isAuthenticated()) { return next(); }
  response.redirect('/login');
}

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

// TODO: May need to move this and split up JSON parsing functionality
// TODO: Could there be an issue with bodyParser with undeleted temp files?
// includes support to parse JSON-encoded bodies (and saving the rawBody)
pointrel20141201Server.initialize(app);
// app.use(bodyParser.json());

// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); 

// All added for passport authentication
// app.use(express.logger());
app.use(cookieParser());
app.use(methodOverride());
app.use(sessionModule({secret: 'tools of abundance', saveUninitialized: true, resave: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Authentication routes

function writePageStart(request, response) {
    var user = request.user;
    response.write("<html><body>");
    if (!user) {
        response.write("<p>");
        response.write('<a href="/">Home</a> | ');
        response.write('<a href="/login">Log In</a>');
        response.write("<p>");
        response.write("<h2>Welcome! Please log in.</h2>");
    } else {
        response.write("<p>");
        response.write('<a href="/">Home</a> |');
        response.write('<a href="/login">Log In</a> | ');
        response.write('<a href="/logout">Log Out</a>');
        response.write("<p>");
        response.write("<h2>Hello, " + user.username + ".</h2>");
    }
}

function writePageEnd(request, response) {
    response.end("</body></html>");
}

app.get('/account', ensureAuthenticated, function(request, response) {
    var user = request.user;
    // res.render('account', { user: req.user })
    writePageStart(request, response);
    response.write("<p>Username: " + user.username + "</p>");
    response.write("<p>Email: " + user.email + "</p>");
    writePageEnd(request, response);
});

var loginTemplate = '<form action="/login" method="post">\n' +
'<div>\n' +
'<label>Username:</label>\n' +
'<input type="text" name="username"/><br/>\n' +
'</div>\n' +
'<div>\n' +
'<label>Password:</label>\n' +
'<input type="password" name="password"/>\n' +
'</div>\n' +
'<div>\n' +
'<input type="submit" value="Submit"/>\n' +
'</div>\n' +
'</form>\n' +
'<p><small>Hint - bob:secret</small></p>';

app.get('/login', function(request, response){
  // res.render('login', { user: req.user, message: req.flash('error') });
    writePageStart(request, response);
    response.write(loginTemplate);
    //applicationLog("request.flash('error')", request.flash("error"));
    var messages = request.flash("error");
    for (var index in messages) {
        response.write("<p><b>" + messages[index] + "</p></b>");
    }
    writePageEnd(request, response);
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/test');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/test');
});


function writeTestPage(request, response) {
    // response.sendFile(pointrelConfig.baseDirectory + "index.html");
    // response.sendFile(baseDirectoryNormalized + "index.html");
    writePageStart(request, response);
    response.write("Example of authentication with passport; authenticated " + request.isAuthenticated());
    var label = "Pointrel App";
    if (config.requireAuthentication) label += " (only available if authenticated)";
    if (request.isAuthenticated()) response.write('<br><a href="/pointrel/pointrel-app">' + label + '</a>');
    writePageEnd(request, response);
}

// Application routes

app.get("/test", function (request, response) {
    writeTestPage(request, response);
});

function getLatestIndexEntry(indexEntries) {
    var latest = null;
    for (var i = 0; i < indexEntries.length; i++) {
        var indexEntry = indexEntries[i];
        if (!latest || indexEntries[i].timestamp >= latest.timestamp)
            latest = indexEntries[i];
    }
    return latest;
}

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

app.use("/$", ensureAuthenticated,   function(req, res) {
    res.redirect('/index.html');
});

app.use("/", ensureAuthenticated, express.static(__dirname + "/../WebContent"));

// TODO: For developer testing only; remove in final version
app.use("/dojo-debug", express.static(__dirname + "/../../PNIWorkbookLibraries/dojo-release-1.10.0-src"));

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

