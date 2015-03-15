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

require([
   "../WebContent/js/panelBuilder/FieldSpecificationCollection.js",
   "../WebContent/js/fieldSpecifications/loadAllFieldSpecifications.js"
], function(
    FieldSpecificationCollection,
    loadAllFieldSpecifications
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
    
    /*
    function generateHelpIndex(allPanels) {
        writeClear();
        
        var currentSection;
        
        allPanels.forEach(function(panel) {
            if (panel.section !== currentSection) {
                currentSection = panel.section;
                console.log("Section: ", currentSection);
                writeln('<span class="narrafirma-helpindex-sectionheader"><b>' + _.capitalize(currentSection) + '</b><div>');
            }
            writeln('<a href="' + currentSection + '/help_' + panel.id + '.html" class="narrafirma-helppageindex-panellink paneltype-' + panel.displayType + '" id="' + panel.id + '">' + panel.displayName + '</a><br>');
        });
        
        var fileName = outputDirectory + "/helpIndex.html";
        
        var fileContents = helpFileTemplate.replace("{{title}}", "NarraFirma Help Index").replace("{{output}}", output);
        
        fs.writeFileSync(fileName, fileContents);
    }
    */
    
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
        
        allFieldSpecs = new FieldSpecificationCollection();
        loadAllFieldSpecifications(allFieldSpecs);
        // console.log("fieldSpecificationCollection", allFieldSpecs); 
        
        var panels = allFieldSpecs.buildListOfPanels();
        
        // console.log("panels", panels);

        allPanels = allFieldSpecs.buildListOfPanels();
        
        allPanels.forEach(function(panel) {
            panel.panelFields = allFieldSpecs.buildQuestionsForPanel(panel.id);
        });
        
        allPanels.forEach(function(panel) {
            generateJSONFile(panel);
            // console.log("output", output);
        });
        
        // generateJSONLoader(allPanels);
    }
    
    main();
});