/*jslint node: true */
"use strict";

var pointrelAccessControl = require("./pointrel20150417/pointrelAccessControl");
var pointrelUtility = require("./pointrel20150417/pointrelUtility");

// Authentication-related
var passport = require("passport");
var passportLocal = require("passport-local");
var flash = require('connect-flash');
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var sessionModule = require("express-session");

// For authentication test; see: https://github.com/jaredhanson/passport-local/blob/master/examples/express3/app.js
var LocalStrategy = passportLocal.Strategy;

// Users are represented as:
// {userIdentifier: "name"}

passport.serializeUser(function(user, done) {
    done(null, user.userIdentifier);
});

passport.deserializeUser(function(id, done) {
    done(null, {userIdentifier: id});
});

passport.use(new LocalStrategy(
    function(userIdentifier, password, done) {
        var userCredentials = {
            userIdentifier: userIdentifier, 
            userPassword: password
        };
        
        var authenticated = pointrelAccessControl.isAuthenticated(userIdentifier, userCredentials);
        
        // If there is no user with the given userIdentifier, or the password is not correct,
        // set the user to `false` to indicate failure and set a flash message
        if (!authenticated) {
            return done(null, false, {message: 'Authentication failed for: ' + userIdentifier});
        }
        
        // Otherwise, return the authenticated `user` which will be stored in the request and accessible by that code
        var user = {userIdentifier: userIdentifier};
        return done(null, user);
    }
));

function writePageStart(request, response, pageType) {
    var user = request.user;
    response.write('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/css/standard.css"></head><body>');
    response.write('<div class="narrafirma-login-welcome-and-intro">');
    response.write('<h2 class="narrafirma-login-welcome">Welcome to NarraFirma</h2>');
    response.write('<p class="narrafirma-login-intro">NarraFirma is software for Participatory Narrative Inquiry. For more information see <a href="http://www.narrafirma.com" target="_blank">narrafirma.com</a> and <a href="http://www.workingwithstories.org" target="_blank">workingwithstories.org</a>.</p>');
    response.write('</div>');
    if (!user) {
        if (pageType !== "login") response.write('<p class="narrafirma-login-text">Please <b><a href="/login">log in</a></b>.</p>');
    } else {
        response.write('<h2 class="narrafirma-login-hello">Hello, ' + user.userIdentifier + ".</h2>");
        response.write("</p>");
    }
}

function writePageEnd(request, response) {
    if (request.user) {
        response.write('<p class="narrafirma-login-action"><a href="/logout">Log out</a>');
        response.write("</p>");
    }
    response.end("</body></html>");
}

var loginTemplate = '<form action="/login" method="post">\n' +
'<div>\n' +
'<label>User name: </label>\n' +
'<input type="text" class="narrafirma-login-input" name="username"/><br/><br/>\n' +
'</div>\n' +
'<div>\n' +
'<label>Password: </label>\n' +
'<input type="password" class="narrafirma-login-input" name="password"/>\n' +
'</div>\n' +
'<div><br/>\n' +
'<input type="submit" class="narrafirma-login-button" value="Log in"/>\n' +
'</div>\n' +
'</form>\n';

function writeLaunchPage(request, response, config) {
    // response.sendFile(pointrelConfig.baseDirectory + "narrafirma.html");
    // response.sendFile(baseDirectoryNormalized + "narrafirma.html");
    writePageStart(request, response, "start");
    const isSuperUser = pointrelAccessControl.isSuperUser(request.user.userIdentifier);
    // response.write("Example of authentication with passport; authenticated " + request.isAuthenticated());
    if (request.isAuthenticated()) response.write('<p class="narrafirma-login-action">Choose a <a href="/narrafirma.html">project</a> to work on</p>');
    if (request.isAuthenticated() && isSuperUser) response.write('<p class="narrafirma-login-action"><a href="/admin.html">Site administration</a></p>');
    writePageEnd(request, response);
}

var config = null;

function ensureAuthenticated(request, response, next) {
    if (!config.requireAuthentication || request.isAuthenticated()) { return next(); }
    response.redirect('/login');
}

function ensureAuthenticatedForJSON(request, response, next) {
    if (!config.requireAuthentication || request.isAuthenticated()) { return next(); }
    response.json(pointrelUtility.makeFailureResponse(403, "Unauthenticated"));
}

function initialize(app, newConfig) {
    
    config = newConfig;
    
    // All added for passport authentication
    // app.use(express.logger());
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(sessionModule({secret: 'tools of abundance', saveUninitialized: true, resave: true}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Authentication routes
    
    app.get('/account', ensureAuthenticated, function(request, response) {
        var user = request.user;
        // res.render('account', { user: req.user })
        writePageStart(request, response, "account");
        response.write('<p class="narrafirma-login-text">Username: ' + user.userIdentifier + "</p>");
        response.write('<p class="narrafirma-login-text">Email: ' + user.email + "</p>");
        writePageEnd(request, response);
    });
    
    app.get('/login', function(request, response){
      // res.render('login', { user: req.user, message: req.flash('error') });
        writePageStart(request, response, "login");
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
        res.redirect('/start');
      });
    
    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/start');
    });
    
    app.get("/start", function (request, response) {
        writeLaunchPage(request, response, config);
    });
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.ensureAuthenticatedForJSON = ensureAuthenticatedForJSON;
exports.initialize = initialize;
