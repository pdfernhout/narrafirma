/*jslint node: true */
"use strict";

var fs = require('fs');
var util = require('util');

var pagesFileName = "../design/pages.json";

var pagesReadFromJSON = JSON.parse(fs.readFileSync(pagesFileName, 'utf8'));
// console.log("pages", pagesReadFromJSON);

// Generate models and pages
// Generate models

console.log("page count", pagesReadFromJSON.length);

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

console.log("--------");

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

var optionsLists = {};
var allChoices = {};

console.log("define([");

pagesReadFromJSON.forEach(function (page) {
    var pageType = "PAGE";
    var modelName = "ProjectModel";
    if (page.isHeader) {
        pageType = "HEADER";
        console.log("\n// ==================== SECTION", page.id, page.name, "==========================");
    }
    console.log("\n// ------------- ", pageType, page.id, page.name, page.type, " ------------- \n");
    
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
            if (optionsAsArray.length === 1) optionsAsArray = optionsAsArray[0];
            else {
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
        var item = {
            id: question.id,
            dataType: typeForDisplayType(question.type),
            options: optionsAsArray,
            displayType: question.type,
            displayName: question.shortText || undefined,
            displayPrompt: question.text,
            displayPage: page.id,
            model: modelName
        };
        // console.log("question", question.id, "\n", JSON.stringify(item, null, 4), "\n");
        // console.log(JSON.stringify(item, null, 4));
        // console.log(item);
        // console.log(",");
        var itemOutput = util.inspect(item);
        // Remove braces at start and end
        itemOutput = " " + itemOutput.substring(1, itemOutput.length - 1);
        var output = "{\n" + itemOutput + "\n},";
        console.log(output);
    });
});

console.log("\n]);");

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