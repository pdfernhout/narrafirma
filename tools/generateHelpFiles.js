/*jslint node: true */
"use strict";

// Convert design (as pages.json) into separate page/panel files which define fields that define *both* GUI and Model

var fs = require('fs');
var util = require('util');

/*global _: true */
var _ = require('lodash');

require = require('amdrequire');

/*
var dojoConfig = {
    XbaseUrl: "../WebContent/", // Where we will put our packages
    Xasync: 1, // We want to make sure we are using the "modern" loader
    XhasCache: {
        "host-node": 1, // Ensure we "force" the loader into Node.js mode
        "dom": 0 // Ensure that none of the code assumes we have a DOM
    },
    // While it is possible to use config-tlmSiblingOfDojo to tell the
    // loader that your packages share the same root path as the loader,
    // this really isn't always a good idea and it is better to be
    // explicit about our package map.
    Xpackages: [{
        name: "dojo",
        location: "../../PNIWorkbookLibraries/dojo-release-1.10.0-src/dojo"
    },{
        name: "app",
        location: "app"
    },{
        name: "app-server",
        location: "app-server"
    }]
};

// Had problem -- wanted to load dojo modules including main.js in tools directory
// Have dojo take over require
require("../../PNIWorkbookLibraries/dojo-release-1.10.0-src/dojo/dojo.js");
*/

/*
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname + "/../WebContent",
});
*/

var outputDirectory = __dirname + "/output/";

require([
   "../WebContent/js/panelBuilder/FieldSpecificationCollection.js",
   "../WebContent/js/fieldSpecifications/loadAllFieldSpecifications.js"
], function(
    FieldSpecificationCollection,
    loadAllFieldSpecifications
) {
    var fieldSpecificationCollection = new FieldSpecificationCollection();
    loadAllFieldSpecifications(fieldSpecificationCollection);
    console.log("fieldSpecificationCollection", fieldSpecificationCollection); 
});