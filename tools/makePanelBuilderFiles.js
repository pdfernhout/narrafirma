/*jslint node: true, multistr: true */
"use strict";

// Generate a bunch of files for refactoring PanelBuilder into smaller modules

var fs = require('fs');

/*global _: true */
var _ = require('lodash');

var outputDirectory = __dirname + "/output/";

var template = 'define([\n\
    "dojox/mvc/at",\n\
    "dijit/layout/ContentPane",\n\
    "dojo/_base/lang",\n\
    "js/translate"\n\
], function(\n\
    at,\n\
    ContentPane,\n\
    lang,\n\
    translate\n\
){\n\
    "use strict";\n\
    \n\
FUNCTIONDEFINITON\n\
    return FUNCTIONNAME;\n\
});';

var filesToMake = {
    // "label": "add_label",
    "header": "add_header",
    "image": "add_image",
    "text": "add_text",
    "textarea": "add_textarea",
    "grid": "add_grid",
    "select": "add_select",
    "boolean": "add_boolean",
    "checkbox": "add_checkbox",
    "checkboxes": "add_checkboxes",
    "radiobuttons": "add_radiobuttons",
    "toggleButton": "add_toggleButton",
    "button": "add_button",
    "report": "add_report",
    "questionsTable": "add_questionsTable",
    "storyBrowser": "add_storyBrowser",
    "storyThemer": "add_storyThemer",
    "graphBrowser": "add_graphBrowser",
    "trendsReport": "add_trendsReport",
    "annotationsGrid": "add_annotationsGrid",
    "accumulatedItemsGrid": "add_accumulatedItemsGrid",
    "excerptsList": "add_excerptsList",
    "storiesList": "add_storiesList",
    "questionAnswer": "add_questionAnswer",
    "questionAnswerCountOfTotalOnPage": "add_questionAnswerCountOfTotalOnPage",
    "listCount": "add_listCount",
    "function": "add_function",
    "quizScoreResult": "add_quizScoreResult"
};

var builderSource = fs.readFileSync(__dirname + "/../WebContent/js/panelBuilder/PanelBuilder.js").toString();
var lines = builderSource.split("\n");

// console.log("builderSource", builderSource);

function extractFunctionSource(functionName) {
    var source = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        // console.log(i, "'" + line + "'");
        if (_.startsWith(line, "    function " + functionName)) {
            // console.log("found: " + functionName);
            for (var j = i; j < lines.length; j++) {
                line = lines[j];
                source += line + "\n";
                if (_.startsWith(line, "    }")) {
                    return source;
                }
            }
            throw new Error("did not find end of source for: " + functionName);
        }
    }
    throw new Error("did not find start of source for: " + functionName);
}

// var test = extractFunctionSource("add_boolean");
// console.log("source", test);

function generateFiles() {
    for (var key in filesToMake) {
        var functionName = filesToMake[key];
        var fileName = outputDirectory + functionName + ".js";
        // console.log("key", key, fileName);
        // var output = template.replace("FUNCTIONDEFINITON", "    function " + functionName + "() {}");
        var source = extractFunctionSource(functionName);
        var output = template.replace("FUNCTIONDEFINITON", source);
        output = output.replace("FUNCTIONNAME", functionName);
        fs.writeFileSync(fileName, output);
    }
}

function generatePluginCalls() {
    for (var key in filesToMake) {
        var functionName = filesToMake[key];
        console.log('addPlugin("' + functionName + '", ' + functionName + ');');
    }
}


function generateImports() {
    var key;
    var functionName;
    var sortedKeys = _.keys(filesToMake);
    sortedKeys.sort();
    // console.log("sortedKeys", sortedKeys);
    _.each(sortedKeys, function (key) {
        functionName = filesToMake[key];
        console.log('    "./' + functionName + '",');
    });
    _.each(sortedKeys, function (key) {
        functionName = filesToMake[key];
        console.log('    ' + functionName + ',');
    });
}

// generateFiles();
// generatePluginCalls();
generateImports();

