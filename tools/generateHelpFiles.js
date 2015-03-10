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
    
    var helpFileTemplate = fs.readFileSync(__dirname + "/generateHelpFiles_template.html").toString();
    
    // console.log("helpFileTemplate", helpFileTemplate);
    
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
    
    function addDivsForPanel(panelID) {
        var fieldSpecs = allFieldSpecs.buildQuestionsForPanel(panelID);
        var panelSpecification = allFieldSpecs.getPanelSpecificationForPanelID(panelID);
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
        
        fieldSpecs.forEach(function (fieldSpec) {
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
            }
            
            write('    <span class="fieldPrompt">');
            write(fieldSpec.displayPrompt);
            writeln('</span>');
            
            writeln('</div>');
            writeln();
        });
        
        writeln('</div>');
        writeln();
    }
    
    function generateHelpFile(helpFileSpec) {
        writeClear();
        
        var pageID = helpFileSpec.shift();
        
        // console.log("", pageID);
        
        addDivsForPanel(pageID);
        
        helpFileSpec.forEach(function (panelID) {
            // console.log("    ", panelID);
            addDivsForPanel(panelID);
        });
        
        var panelSpec = allFieldSpecs.getPanelSpecificationForPanelID(pageID);
        var section = panelSpec.section;
              
        var sectionDirectory = outputDirectory + section;
        if (!fs.existsSync(sectionDirectory)) {
            console.log("creating directory for section", section, sectionDirectory);
            fs.mkdirSync(sectionDirectory);
        }
        
        var fileName = outputDirectory + section + "/help_" + pageID + ".html";
        console.log("Writing: ", fileName);
        
        var title = "NarraFirma help on " + section + " :: " + pageID;
        var fileContents = helpFileTemplate.replace("{{title}}", title).replace("{{output}}", output);
  
        fs.writeFileSync(fileName, fileContents);
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
            // console.log("output", output);
        });
    }
    
    main();
});