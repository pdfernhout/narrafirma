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
    
    var allFieldSpecs;
    
    var allAddedPanels = [];
    
    function addNestedPanels(panelID, panels) {
        // console.log("addNestedPanels", panelID);
        if (panels.indexOf(panelID) !== -1) return;
        // console.log("processing", panelID);
        panels.push(panelID);
        if (allAddedPanels.indexOf(panelID) !== -1) {
            console.log("duplicate panel help for: ", panelID);
        } else {
            allAddedPanels.push(panelID);
        }
        var fieldSpecs = allFieldSpecs.buildQuestionsForPanel(panelID);
        for (var i = 0; i < fieldSpecs.length; i++) {
            var fieldSpec = fieldSpecs[i];
            if (_.isString(fieldSpec.displayConfiguration) && _.startsWith(fieldSpec.displayConfiguration, "panel_")) {
                // console.log("following ", panelID, fieldSpec.id, fieldSpec.displayType);
                addNestedPanels(fieldSpec.displayConfiguration, panels);
            }
            /*
            if (fieldSpec.displayType === "grid") {
                addNestedPanel(fieldSpec.displayConfiguration);
            }
            */
        }
    }
    
    function generateHelpFile(helpFileSpec) {
        var helpFilePage = helpFileSpec.shift();

        console.log("", helpFilePage);
        helpFileSpec.forEach(function (panelID) {
            console.log("    ", panelID);
        });
    }
    
    function main() {
        console.log("generateHelpFiles", new Date());
        
        allFieldSpecs = new FieldSpecificationCollection();
        loadAllFieldSpecifications(allFieldSpecs);
        // console.log("fieldSpecificationCollection", allFieldSpecs); 
        
        var pages = allFieldSpecs.buildListOfPages();
        
        // console.log("pages", pages);
        
        var helpFiles = [];
        
        pages.forEach(function (page) {
            var panels = [];
  
            addNestedPanels(page.id, panels);
            
            helpFiles.push(panels);
        });
        
        // console.log("helpFiles", helpFiles);
        
        // console.log("allAddedPanels", allAddedPanels);
        
        var allPanels = allFieldSpecs.buildListOfPanels();
        
        allPanels.forEach(function (panel) {
            if (allAddedPanels.indexOf(panel.id) === -1) {
                // console.log("!!! No help for", panel.id);
                helpFiles.push([panel.id]);
            }
        });
        
        helpFiles.forEach(function (helpFileSpec) {
            generateHelpFile(helpFileSpec);
        });
    }
    
    main();
});