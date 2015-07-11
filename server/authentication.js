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
    response.write("<html><body>");
    if (!user) {
        response.write("<p>");
        // response.write('<a href="/">Home</a> | ');
        // if (pageType !== "login") response.write('<a href="/login">Login page</a>');
        // if (pageType !== "login") response.write("<p>");
        response.write('<h2>Welcome to NarraFirma!</h2>');
        if (pageType !== "login") response.write(' Please <b><a href="/login">log in</a></b>.');
    } else {
        response.write("<p>");
        // response.write('<a href="/index.html">Start NarraFirma</a>');
        // if (pageType !== "login") response.write('<a href="/login">Log In</a> | ');
        response.write('<a href="/logout">Logout</a>');
        if (pageType !== "account") response.write(' | <a href="/account">Account</a>');
        response.write("<p>");
        response.write("<h2>Hello, " + user.userIdentifier + ".</h2>");
    }
}

function writePageEnd(request, response) {
    response.end("</body></html>");
}

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
'<input type="submit" value="Login"/>\n' +
'</div>\n' +
'</form>\n';

function writeTestPage(request, response, config) {
    // response.sendFile(pointrelConfig.baseDirectory + "index.html");
    // response.sendFile(baseDirectoryNormalized + "index.html");
    writePageStart(request, response, "start");
    // response.write("Example of authentication with passport; authenticated " + request.isAuthenticated());
    if (request.isAuthenticated()) response.write('<br><a href="/index.html">Start NarraFirma project application</a>');
    if (request.isAuthenticated()) response.write('<br><a href="/project-admin.html">Start NarraFirma administration</a>');
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
        response.write("<p>Username: " + user.userIdentifier + "</p>");
        response.write("<p>Email: " + user.email + "</p>");
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
        writeTestPage(request, response, config);
    });
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.ensureAuthenticatedForJSON = ensureAuthenticatedForJSON;
exports.initialize = initialize;
