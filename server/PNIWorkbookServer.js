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
var Pointrel20130202Server = require("./Pointrel20130202Server");

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
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

function ensureAuthenticated(request, response, next) {
  if (!Pointrel20130202Server.pointrelConfig.requireAuthentication || request.isAuthenticated()) { return next(); }
  response.redirect('/login');
}

// Main code

console.log("Pointrel20130202 server for nodejs started: " + Date());

console.log("__dirname", __dirname);

var app = express();

// TODO: Could there be an issue with bodyParser with undeleted temp files?
//to support JSON-encoded bodies
app.use(bodyParser.json());

//to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); 

var logger = function(request, response, next) {
    console.log("Requesting:", request.url);
    next();
};

app.use(logger);

// All added for passport authentication
// app.use(express.logger());
app.use(cookieParser());
// Have already added bodyParser above, is it enough?
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
    //console.log("request.flash('error')", request.flash("error"));
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
    if (Pointrel20130202Server.pointrelConfig.requireAuthentication) label += " (only available if authenticated)";
    if (request.isAuthenticated()) response.write('<br><a href="/pointrel/pointrel-app">' + label + '</a>');
    writePageEnd(request, response);
}

// Application routes

//app.get("/", function (request, response) {
//    response.sendFile(Pointrel20130202Server.pointrelConfig.baseDirectory + "index.html");
//});

//app.get("/index.html", function (request, response) {
//    response.sendFile(Pointrel20130202Server.pointrelConfig.baseDirectory + "index.html");
//});

app.get("/test", function (request, response) {
    writeTestPage(request, response);
});

app.get("/cgi-bin/journal-store.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.journalStore(request, response);
});

app.post("/cgi-bin/journal-store.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.journalStore(request, response);
});

app.get("/cgi-bin/resource-add.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.resourceAdd(request, response);
});

app.post("/cgi-bin/resource-add.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.resourceAdd(request, response);
});

app.get("/cgi-bin/resource-get.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.resourceGet(request, response);
});

app.post("/cgi-bin/resource-get.php", ensureAuthenticated, function (request, response) {
    Pointrel20130202Server.Pointrel20130202Server.resourceGet(request, response);
});

//app.get("/cgi-bin/resource-publish.php", ensureAuthenticated, function (request, response) {
//    Pointrel20130202Server.resourcePublish(request, response);
//});
//
//app.post("/cgi-bin/resource-publish.php", ensureAuthenticated, function (request, response) {
//    Pointrel20130202Server.resourcePublish(request, response);
//});

//app.get("/cgi-bin/variable-query.php", ensureAuthenticated, function (request, response) {
//    Pointrel20130202Server.variableQuery(request, response);
//});
//
//app.post("/cgi-bin/variable-query.php", ensureAuthenticated, function (request, response) {
//    Pointrel20130202Server.variableQuery(request, response);
//});

app.use("/$", ensureAuthenticated,   function(req, res) {
    res.redirect('/index.html');
});

app.use("/", ensureAuthenticated, express.static(__dirname + "/../WebContent"));

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//Create an HTTP service.
var server = http.createServer(app).listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Pointrel20130202 app listening at http://%s:%s", host, port);
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
  console.log("PNIWorkbookServer app listening at https://%s:%s", host, port);
});

