/*jslint node: true */
"use strict";

// Convert design (as pages.json) into separate page/panel files which define fields that define *both* GUI and Model

var fs = require('fs');
var util = require('util');

/* global _: true */
var _ = require('lodash');

/* global require: true */
require = require('amdrequire');

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