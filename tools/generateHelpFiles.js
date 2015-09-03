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
   "../webapp/js/panelBuilder/PanelSpecificationCollection.js",
   "../webapp/js/applicationPanelSpecifications/loadAllPanelSpecifications.js"
], function(
    PanelSpecificationCollection,
    loadAllPanelSpecifications
) {
    
    var allFieldSpecs;
    var allPanels;
    
    var allAddedPanels = [];
    
    var helpFileTemplate = fs.readFileSync(__dirname + "/generateHelpFiles_template.html").toString();
    
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
    
    function addDivsForPanel(panelSpecification) {
        var panelID = panelSpecification.id;
        
        var panelsUsed = [];
        
        write('<div id="');
        write(panelID);
        write('" class="');
        write(panelSpecification.displayType);
        write('"');
        writeln('>');
        writeln();
        
        writeln('<div class="pageHeader">');
        
        write('    <span class="pageName">');
        write(panelSpecification.displayName);
        writeln('</span>');
        
        write('    <span class="section">');
        write(panelSpecification.section);
        writeln('</span>');
        
        writeln('</div>');
        writeln();
        
        panelSpecification.panelFields.forEach(function(fieldSpec) {
            write('<div id="');
            write(fieldSpec.id);
            write('" class="field">');
            writeln();
            
            if (fieldSpec.displayName) {
                write('    <span class="fieldName">');
                write(fieldSpec.displayName);
                writeln('</span>');
            }
            
            write('    <span class="fieldType">');
            write(fieldSpec.displayType);
            writeln('</span>');
            
            if (fieldSpec.displayConfiguration) {
                write('    <span class="displayConfiguration">');
                write(JSON.stringify(fieldSpec.displayConfiguration));
                writeln('</span>');
                
                if (_.isString(fieldSpec.displayConfiguration) && _.startsWith(fieldSpec.displayConfiguration, "panel_") && fieldSpec.displayType !== "button") {
                    // console.log("following ", panelID, fieldSpec.id, fieldSpec.displayType);
                    panelsUsed.push(fieldSpec.displayConfiguration);
                }
            }
            
            write('    <span class="fieldPrompt">');
            write(fieldSpec.displayPrompt);
            writeln('</span>');
            
            writeln('</div>');
            writeln();
        });
        
        panelsUsed.forEach(function(panelID) {
            var usedPanelSpec = allFieldSpecs.getPanelSpecificationForPanelID(panelID);
            if (!usedPanelSpec) console.log("missing panel spec for", panelID);
            writeln('<a href="help_' + panelID + '.html" class="narrafirma-helppage-panellink">Uses panel: ' + usedPanelSpec.displayName + '</a><br>'); 
        });
        
        writeln('</div>');
        writeln();
    }
    
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
    
    function generateHelpFile(panelSpec) {
        writeClear();
        
        var panelID = panelSpec.id;

        // console.log("", panelID);
        
        writeln('<a href="../helpIndex.html#' + panelID + '" class="narrafirma-helpindex-backlink">Go to main help index</a><br><br>');
        
        if (panelSpec.displayType === "panel") {
            allPanels.forEach(function(possiblePageSpec) {
                possiblePageSpec.panelFields.forEach(function(fieldSpec) {
                    // console.log("fieldSpec.displayConfiguration", fieldSpec.displayConfiguration, panelID);
                    if (fieldSpec.displayConfiguration === panelID) {
                        console.log("using panel on page", panelSpec.id, possiblePageSpec.id, fieldSpec.id);
                        writeln('<a href="help_' + possiblePageSpec.id + '.html#' + fieldSpec.id + '" class="narrafirma-helppage-backlink">Used in ' + possiblePageSpec.displayType + ': ' + possiblePageSpec.displayName + '</a><br>'); 
                    }
                });
            });
        }
        
        addDivsForPanel(panelSpec);
        
        var section = panelSpec.section;
              
        var sectionDirectory = outputDirectory + section;
        if (!fs.existsSync(sectionDirectory)) {
            console.log("creating directory for section", section, sectionDirectory);
            fs.mkdirSync(sectionDirectory);
        }
        
        var fileName = outputDirectory + section + "/help_" + panelID + ".html";
        console.log("Writing: ", fileName);
        
        var title = "NarraFirma help on " + section + " :: " + panelSpec.displayName;
        var fileContents = helpFileTemplate.replace("{{title}}", title).replace("{{output}}", output);
  
        fs.writeFileSync(fileName, fileContents);
    }
    
    function main() {
        console.log("generateHelpFiles", new Date());
        
        allFieldSpecs = new PanelSpecificationCollection();
        loadAllPanelSpecifications(allFieldSpecs);
        // console.log("fieldSpecificationCollection", allFieldSpecs); 
        
        var panels = allFieldSpecs.buildListOfPanels();
        
        // console.log("pages", pages);

        allPanels = allFieldSpecs.buildListOfPanels();
        
        allPanels.forEach(function(panel) {
            panel.panelFields = allFieldSpecs.buildQuestionsForPanel(panel.id);
        });
        
        allPanels.forEach(function(panel) {
            generateHelpFile(panel);
            // console.log("output", output);
        });
        
        generateHelpIndex(allPanels);
    }
    
    main();
});