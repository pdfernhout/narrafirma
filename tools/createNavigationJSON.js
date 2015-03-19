/*jslint node: true */
"use strict";

// Convert AMD modules defining a list of "questions" some of which are panels or pages
// into JSON files which define panels with fields.
// These fields define *both* GUI and Model

var fs = require('fs');
var util = require('util');

/* global _: true */
var _ = require('lodash');

/* global require: true */
require = require('amdrequire');

var outputDirectory = __dirname + "/output/";

// Does not work with this error, probably due to not supporting loading text?
/*
module.js:236
  var start = request.substring(0, 2);
                      ^
TypeError: Object false has no method 'substring'
    at Function.Module._resolveLookupPaths (module.js:236:23)
    at Function.Module._resolveFilename (module.js:328:31)
    at Function.Module._load (module.js:280:25)
    at noderequire (/Users/pdf/workspace/PNIWorkbook/tools/node_modules/amdrequire/amdrequire.js:10:17)
    at /Users/pdf/workspace/PNIWorkbook/tools/node_modules/amdrequire/amdrequire.js:54:5
    at Array.forEach (native)
    at amdrequire (/Users/pdf/workspace/PNIWorkbook/tools/node_modules/amdrequire/amdrequire.js:37:8)
    at define (/Users/pdf/workspace/PNIWorkbook/tools/node_modules/amdrequire/amdrequire.js:115:10)
    at Object.<anonymous> (/Users/pdf/workspace/PNIWorkbook/WebContent/js/applicationPanelSpecifications/loadAllPanelSpecifications.js:1:63)
    at Module._compile (module.js:456:26)
 */

require([
   "../WebContent/js/panelBuilder/PanelSpecificationCollection.js",
   "../WebContent/js/applicationPanelSpecifications/loadAllPanelSpecifications.js"
], function(
    PanelSpecificationCollection,
    loadAllPanelSpecifications
) {
    
    var allFieldSpecs;
    var allPanels;
    
    var allAddedPanels = [];
    
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
    
    function generateJSONFile(panelSpec) {
        writeClear();
        
        var panelID = panelSpec.id;

        // console.log("", panelID);
        
        // Remove field metadata about model class and page
        panelSpec.panelFields.forEach(function(fieldSpec) {
            fieldSpec.displayPanel = undefined;
            fieldSpec.modelClass = undefined;
        });
        
        // addDivsForPanel(panelSpec);
        
        var section = panelSpec.section;
              
        var sectionDirectory = outputDirectory + section;
        if (!fs.existsSync(sectionDirectory)) {
            console.log("creating directory for section", section, sectionDirectory);
            fs.mkdirSync(sectionDirectory);
        }
        
        var fileName = outputDirectory + section + "/" + panelID + ".json";
        console.log("Writing: ", fileName);
        
        // Is JSON going to be as easy to read as AMD JavaScript given all the quoted strings?
        var fileContents = JSON.stringify(panelSpec, null, 4);
  
        fs.writeFileSync(fileName, fileContents);
    }
    
    function main() {
        console.log("generateHelpFiles", new Date());
        
        allFieldSpecs = new PanelSpecificationCollection();
        loadAllPanelSpecifications(allFieldSpecs);
        // console.log("fieldSpecificationCollection", allFieldSpecs); 
        
        var panels = allFieldSpecs.buildListOfPanels();
        
        // console.log("panels", panels);

        allPanels = allFieldSpecs.buildListOfPanels();
        
        allPanels.forEach(function(panel) {
            console.log("panel", panel.displayType, panel.id, panel.section, panel.displayName);
            // generateJSONFile(panel);
            // console.log("output", output);
        });
        
        // generateJSONLoader(allPanels);
    }
    
    main();
});