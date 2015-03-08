/*jslint node: true */
"use strict";

// Convert design (as pages.json) into separate page/panel files which define fields that define *both* GUI and Model

var fs = require('fs');
var util = require('util');

/*global _: true */
var _ = require('lodash');

var outputDirectory = __dirname + "/output/";

var pagesFileName = __dirname + "/../design/pages.json";

var pagesReadFromJSON = JSON.parse(fs.readFileSync(pagesFileName, 'utf8'));
// console.log("pages", pagesReadFromJSON);

// Generate models and pages
// Generate models

console.log("// generated from design_pages_notes.txt on " + new Date());
console.log("");
console.log("// page count", pagesReadFromJSON.length);

var questionCount = 0;
pagesReadFromJSON.forEach(function (page) {
    questionCount += page.questions.length;
});

console.log("// field count", questionCount);
console.log("");

function rewritePageIDAsModelName(pageID) {
    var modelName = pageID.substring(5);
    
    if (modelName.indexOf("addNew") === 0) {
        modelName = modelName.substring(6);
    } else if (modelName.indexOf("createOrEdit") === 0) {
        modelName = modelName.substring(12);
    } else if (modelName.indexOf("add") === 0) {
        modelName = modelName.substring(3);
    }
    
    modelName = modelName[0].toUpperCase() + modelName.substring(1);
    return modelName  + "Model";
}

/*
pagesReadFromJSON.forEach(function (page) {
    console.log("page", page.id, rewritePageIDAsModelName(page.id));
});
*/

// console.log("--------");

var displayTypeToDataTypeMap = {
    label: "none",
    image: "none",
    textarea: 'string',
    text: 'string',
    grid: 'array',
    header: "none",
    select: "string",
    clusteringDiagram: 'object',
    quizScoreResult: "none",
    button: "none",
    report: "none",
    recommendationTable: "none",
    checkboxes: 'dictionary',
    templateList: "none",
    "function": "none",
    storyBrowser: 'none',
    storyThemer: 'none',
    graphBrowser: 'none',
    trendsReport: 'none',
    observationsList: 'none',
    accumulatedItemsGrid: 'none',
    excerptsList: 'none',
    annotationsGrid: 'none',
    storiesList: 'none',
    boolean: 'boolean'
};

function typeForDisplayType(displayType) {
    // displayTypeToDataTypeMap[displayType] = "string";
    return displayTypeToDataTypeMap[displayType];
}

var output = "";

function write(text) {
    output += text;
}

function writeln(text) {
    output += text + "\n";
}

function outputStringForItem(item) {
    /*
    var itemOutput = util.inspect(item);
    // Remove braces at start and end
    itemOutput = " " + itemOutput.substring(1, itemOutput.length - 1);
    var output = "{\n" + itemOutput + "\n}";
    write(output);
    */
    writeln("        {");
    var first = true;
    for (var key in item) {
        var value = item[key];
        if (value) {
            if (first) {
                first = false;
            } else {
                writeln(",");
            }
            write("            " + key + ": " + JSON.stringify(value));
        }
    }
    write("\n        }");
}

var optionsLists = {};
var allChoices = {};
var typesWithChoices = {};

function header() {
  return 'define([], function() {\n    "use strict";\n    return [';
}

function footer() {
    return "    ];\n});";
}

var section = "main";
var sectionDirectory = outputDirectory + section;

pagesReadFromJSON.forEach(function (page) {
    output = "";
    writeln(header());
    
    var modelName = "ProjectModel";
    
    if (!page.isHeader) {
        if (page.type === "popup") {
            modelName = rewritePageIDAsModelName(page.id);
            console.log("// Generate model", modelName, "\n");
        }
    }
    
    var panelID = page.id;
    if (page.type === "popup") panelID = panelID.replace("page_", "panel_");
    
    var extraForHeader = "";

    if (page.isHeader) {
        console.log("\n// ==================== SECTION", page.name, "==========================");
        extraForHeader = " HEADER";
        section = _.snakeCase(page.name);
        
        var sectionDirectory = outputDirectory + section;
        if (!fs.existsSync(sectionDirectory)) {
            console.log("creating directory for section", section, sectionDirectory);
            fs.mkdirSync(sectionDirectory);
        }
    }
    // console.log("\n// -------------" + extraForHeader, page.type, panelID, page.name, " ------------- \n");
    
    var modelPath = page.options;
    // if (modelPath) modelPath = modelPath.toLowerCase();
        
    var panelItem = {
        id: panelID,
        displayName: page.name,
        displayType: page.type,
        isHeader: page.isHeader,
        // displayPanel: panelID,
        section: section,
        // modelPath: modelPath,
        modelClass: modelName
    };
    
    if (page.type === "popup") {
        panelItem.displayType = "panel";
    }
    
    outputStringForItem(panelItem);
    
    page.questions.forEach(function (question) {
        writeln(",");
        var optionsAsArray;
        var displayOptions;
        if (question.options) {
            optionsAsArray = question.options.split(";");
            if (optionsAsArray.length === 1) {
                displayOptions = optionsAsArray[0];
                optionsAsArray = undefined;
                if (displayOptions.indexOf("page_") === 0) displayOptions = displayOptions.replace("page_", "panel_");
                typesWithChoices[question.type] = 1;
            } else {
                typesWithChoices[question.type] = 2;
                var list = optionsLists[question.options] || [];
                list.push(question.id);
                optionsLists[question.options] = list;
                optionsAsArray.forEach(function (option) {
                    // console.log("adding option", option, question.id);
                    var list2 = allChoices[option] || [];
                    list2.push(question.id);
                    allChoices[option] = list2;
                });
            }
        }
        if (optionsAsArray && (question.type !== "select" && question.type !== "checkboxes" && question.type !== "radiobuttons")) {
            if (displayOptions) throw new Error("unexpected displayOptions and also dataOptions for: " + question.id);
            displayOptions = optionsAsArray;
            optionsAsArray = undefined;
        }
        // Streamline common case of just one option
        var dataType = typeForDisplayType(question.type);
        var item = {
            id: question.id,
            dataType: dataType,
            dataOptions: optionsAsArray,
            required: dataType !== "none" && question.type !== "checkboxes" && question.shortText !== "Notes",
            validators: undefined,
            displayType: question.type,
            displayConfiguration: displayOptions,
            displayName: question.shortText || undefined,
            displayPrompt: question.text
            // displayPanel: panelID,
            // model: modelName
        };
        // console.log("question", question.id, "\n", JSON.stringify(item, null, 4), "\n");
        outputStringForItem(item);
    });
    
    writeln("");
    writeln(footer());
    
    // fs.writeF
    var fileName = outputDirectory + section +  "/" + panelID + ".js";
    console.log("writing", fileName);
    console.log(output);
    fs.writeFileSync(fileName, output);
});

// console.log("displayTypeToDataTypeMap", displayTypeToDataTypeMap);

function printOptionsLists() {
    console.log("\n\noptionsLists", optionsLists);
    
    console.log("\t\nallChoices", allChoices);
    
    console.log("\ntranslate options {");
    var keys = Object.keys(allChoices);
    keys.sort();
    keys.forEach(function(key) {
        console.log("\"option:" + key + "\": \"" + key + "\",");
    });
    console.log("}");
}

// printOptionsLists();

// console.log("types with choices", typesWithChoices);