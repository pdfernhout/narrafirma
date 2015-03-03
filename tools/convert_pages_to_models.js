/*jslint node: true */
"use strict";

var fs = require('fs');
var util = require('util');

var pagesFileName = "../design/pages.json";

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

function outputStringForItem(item) {
    var itemOutput = util.inspect(item);
    // Remove braces at start and end
    itemOutput = " " + itemOutput.substring(1, itemOutput.length - 1);
    var output = "{\n" + itemOutput + "\n},";
    console.log(output);
}

var optionsLists = {};
var allChoices = {};
var typesWithChoices = {};

console.log('define([], function() {\n"use strict";\nreturn [');

pagesReadFromJSON.forEach(function (page) {
    var modelName = "ProjectModel";
    
    var panelID = page.id.replace("page_", "panel_");
    
    var extraForHeader = "";
    
    if (page.isHeader) {
        console.log("\n// ==================== SECTION", page.name, "==========================");
        extraForHeader = " HEADER";
    }
    console.log("\n// -------------" + extraForHeader, page.type, panelID, page.name, " ------------- \n");
    
    var panelItem = {
        id: panelID,
        displayName: page.name,
        displayType: page.type,
        isHeader: page.isHeader,
        displayPanel: panelID,
        modelPath: ("" + page.options).toLowerCase()
    };
    
    outputStringForItem(panelItem);
    console.log("");
    
    // console.log("page", page, "\n");
    if (!page.isHeader) {
        if (page.type === "popup") {
            modelName = rewritePageIDAsModelName(page.id);
            console.log("// Generate model", modelName, "\n");
        }
    }
    page.questions.forEach(function (question) {
        var optionsAsArray;
        if (question.options) {
            optionsAsArray = question.options.split(";");
            if (optionsAsArray.length === 1) {
                optionsAsArray = optionsAsArray[0];
                if (optionsAsArray.indexOf("page_") === 0) optionsAsArray = optionsAsArray.replace("page_", "panel_");
            } else {
                typesWithChoices[question.type] = true;
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
        // Streamline common case of just one option
        var dataType = typeForDisplayType(question.type);
        var item = {
            id: question.id,
            dataType: dataType,
            required: dataType !== "none" && question.type !== "checkboxes" && question.shortText !== "Notes",
            validators: undefined,
            options: optionsAsArray,
            displayType: question.type,
            displayName: question.shortText || undefined,
            displayPrompt: question.text,
            displayPanel: panelID,
            model: modelName
        };
        // console.log("question", question.id, "\n", JSON.stringify(item, null, 4), "\n");
        outputStringForItem(item);
    });
});

console.log("\n];\n});");

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