/*jslint node: true */
"use strict";

// Convert design (as pages.json) into separate page/panel files which define fields that define *both* GUI and Model

var fs = require('fs');
var util = require('util');

/* global _: true */
var _ = require('lodash');

var outputDirectory = __dirname + "/output/";

var modelSpecifications = require("./allModels.json");
    
var allFieldSpecs;
var allPanels;

var allAddedPanels = [];

// console.log("helpFileTemplate", helpFileTemplate);

var output = "";

function writeClear() {
    output = "";
}

function write(text) {
    output += text;
}

function writeln(text) {
    if (!text) text = "";
    output += text + "\n";
}

function main() {
    console.log("generateModels", new Date());
    
    // console.log("modelSpecifications", modelSpecifications);
    
    for (var key in modelSpecifications) {
        writeClear();
        var fieldSpecifications = modelSpecifications[key];
        //fieldSpecifications.forEach(function (fieldSpecification) {
        // });
        
        var fileContents = JSON.stringify(fieldSpecifications, null, 4);
        fs.writeFileSync(outputDirectory + key + ".json", fileContents);
        
    }
}

main();
