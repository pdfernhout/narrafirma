/*jslint node: true */
"use strict";

// Run with node.js
// This generates various files with code derived from design/design_pages_notes.txt, which is parsed via the parse-design.js module.
// It generates "page_*" files in the js/pages folder to correspond with each page.
// It generates js/pages/allPages.js which has a structure with all the pages
// It generates and allPagesSummary.js which defines the domain data model and also has information about what pages go with what headers
// It generates js/nls/pageMessages.js translation file

// Various files to be written and their locations
var translationFileName = "../WebContent/js/nls/pageMessages.js";
var pagesFolder = "../WebContent/js/pages/";
var allPagesFileName = pagesFolder + "allPages.js";
var allPagesSummaryFileName = pagesFolder +  "allPagesSummary.js";

var parseDesign = require("./parse-design.js");
var pages = parseDesign.pages;

var fs = require('fs');

var allOutput = "";

function addOutput(output) {
  allOutput = allOutput + output;
}

function errorHandler(fileName) {
    return function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file " + fileName + " was written.");
        }
    };
}

//Next function from: http://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify
function iterateObjectAlphabetically(obj, callback) {
    var arr = [];
    var i;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i);
        }
    }

    arr.sort();

    for (i = 0; i < arr.length; i++) {
        // console.log( obj[arr[i]] ); //here is the sorted value
        //do what you want with the object property
        if (callback) {
            callback(obj, arr[i]);
        }
    }
}

var translations = {};
var typesToTranslateOptions = {"radiobuttons": true, "checkboxes": true, "select": true};
var pageFileNames = "";
var pageNames = "";
var pageReturn = "";
var firstPage = true;

var notReportable = {"label": true, "header": true, "button": true};

var fileTemplate = "// Generated from design\n" +
"\"use strict\";\n" +
"\n" +
"define([], function() {\n" +
"\n" +
"    var questions = [\n{{questions}}\n    ];\n" +
"\n" +
"    function buildPage(builder, contentPane, model) {\n" +
"{{body}}" +
"    }\n" +
"\n" +
"    return {\n" +
"        \"id\": \"{{pageID}}\",\n" +
"        \"type\": \"{{pageType}}\",\n" +
"        \"isHeader\": {{isHeader}},\n" +
"        \"questions\": questions,\n" +
"        \"buildPage\": buildPage\n" +
"    };\n" +
"});";

function writePageFiles() {
    for (var pageIndex in pages) {
        var page = pages[pageIndex];
        
        // maintain info needed to make allPages file
        if (firstPage) {
            firstPage = false;
        } else {
            pageFileNames = pageFileNames + ",\n";
            pageNames = pageNames + ",\n";
            pageReturn = pageReturn + ",\n";
        }
        pageFileNames = pageFileNames + "    \"./" + page.id + "\"";
        pageNames = pageNames + "    " + page.id;
        pageReturn = pageReturn + "    \"" + page.id + "\": " + page.id;
        
        translations[page.id + "::title"] = page.name;
        var fileName = pagesFolder + page.id + ".js";
        var fileContent = fileTemplate;
        fileContent = fileContent.replace("{{pageID}}", page.id);
        fileContent = fileContent.replace("{{pageType}}", page.type);
        fileContent = fileContent.replace("{{isHeader}}", page.isHeader);
        allOutput = "";
        // var simpleQuestions = [];
        var questionOutput = "";
        var optionsSplit;
        for (var questionIndex in page.questions) {
            var question = page.questions[questionIndex];
            var options = question.options;
            var optionsPrinted = "";
            // optionsSplit is intentionally undefined so it will not appear in simpleQuestions if not defined
            optionsSplit = undefined;
            if (question.options) {
                optionsPrinted = ", " + JSON.stringify(options.split(";"));
            }
            
            addOutput("        widgets.add_" + question.type + "(contentPane, model, \"" + question.id + "\"" + optionsPrinted + ");\n");
            translations[question.id + "::prompt"] = question.text;
            if (question.shortText) {
                translations[question.id + "::shortName"] = question.shortText;
            } else if (question.type !== "label" && question.type !== "header" && question.type !== "image" && question.type !== "button" && question.type !== "report" && question.type !== "quizScoreResult") {
                console.log("No short name for field: " + question.id + " type: " + question.type + " text: " + question.text);
            }
            
            if (question.options) {
                optionsSplit = question.options.split(";");
                if (question.type in typesToTranslateOptions) {
                    for (var optionIndex in optionsSplit) {
                        var option = optionsSplit[optionIndex];
                        translations[question.id + "::selection:" + option] = option;
                    }
                }
            }
            var isInReport = !(question.type in notReportable);
            var isGridColumn = (question.shortText !== null);
            // simpleQuestions.push({"id": question.id, "type": question.type, "isReportable": isReportable, "isGridHeader": isGridHeader});
            var questionInfo = {"id": question.id, "type": question.type, "isInReport": isInReport, "isGridColumn": isGridColumn, "options": optionsSplit};
            if (questionOutput) questionOutput += ",\n";
            questionOutput += "        " + JSON.stringify(questionInfo).split(',"').join(', "'); //.split('":').join('": ');
        }
        
        fileContent = fileContent.replace("{{questions}}", questionOutput);
        // To write direct calls:
        // fileContent = fileContent.replace("{{body}}", allOutput);
        fileContent = fileContent.replace("{{body}}", "        builder.addQuestions(questions, contentPane, model);\n");
        fs.writeFile(fileName, fileContent, errorHandler(fileName));
    }
}

var allPagesFileTemplate = "\"use strict\";\n" +
"\n" +
"define([\n" +
"{{pageFileNames}}\n" +
"], function(\n" +
"{{pageNames}}\n" +
") {\n" +
"    return {\n" +
"{{pageReturn}}\n" +
"    };\n" +
"});";

function writeAllPagesFile() {

    var allPagesFileContent = allPagesFileTemplate;
    allPagesFileContent = allPagesFileContent.replace("{{pageFileNames}}", pageFileNames);
    allPagesFileContent = allPagesFileContent.replace("{{pageNames}}", pageNames);
    allPagesFileContent = allPagesFileContent.replace("{{pageReturn}}", pageReturn);
    
    fs.writeFile(allPagesFileName, allPagesFileContent, errorHandler(allPagesFileName));
}

function writeTranslationsFile() {
    
    allOutput = "";
    addOutput("// Not indented correctly to make it easier to cut and paste to other language files\n" +
            "// See: http://dojotoolkit.org/documentation/tutorials/1.9/i18n/\n" +
            "define({\n" +
            "    root: {\n");
    
    var first = true;
    iterateObjectAlphabetically(translations, function(translations, key) {
        if (!first) {
            addOutput(",\n");
        } else {
            first = false;
        }
        addOutput("    " + JSON.stringify(key) + ": " + JSON.stringify(translations[key]));
    });
    
    addOutput("\n");
    addOutput("}\n" +
    "});");
    
    fs.writeFile(translationFileName, allOutput, errorHandler(translationFileName));
}

////// Model writing

var modelTypes = {
        text: 1,
        textarea: 1,
        boolean: 1,
        select: 1,
        imageUploader: 1,
        toggleButton: 1,
        checkboxes: 1,
        checkboxesWithPull: 1,
        excerptsList: 1,
        grid: 1,
        annotationsGrid: 1,
        accumulatedItemsGrid: 1,
        // storyBrowser: 1,
        storyThemer: 1,
        graphBrowser: 1,
        clusterSpace: 1,
        quizScoreResult: 1,
        report: 1
};

function outputModel() {
    var unusedTypes = {};
    var model = {};
    var pagesToGoWithHeaders = {};
    var lastHeader = null;
    var pageIndex;
    var page;
    var questionIndex;
    var question;
    for (pageIndex in pages) {
        page = pages[pageIndex];
        if (page.isHeader) {
            pagesToGoWithHeaders[page.id] = [];
            lastHeader = page.id;
        } else {
            pagesToGoWithHeaders[lastHeader].push(page.id);
        }
        if (page.type === "page") {
            // console.log("page", page);
            for (questionIndex in page.questions) {
                question = page.questions[questionIndex];
                if (modelTypes[question.type]) {
                    // console.log("question", question.id, question.type);
                    if (question.type === "grid" || question.type === "annotationsGrid" || question.type === "accumulatedItemsGrid") {
                        model[question.id] = [];
                    } else if (question.type === "text" || question.type === "textarea") {
                        model[question.id] = "";
                    } else {
                        model[question.id] = null;
                    }
                } else {
                    unusedTypes[question.type] = 1;
                }
            }
        }
    }
    for (var key in unusedTypes) {
        console.log("unusedType for model: ", key);
    }

    // console.log("Pages to go with headers", JSON.stringify(pagesToGoWithHeaders, null, "  "));
    addOutput("var pagesToGoWithHeaders = " + JSON.stringify(pagesToGoWithHeaders, null, "    "));
    addOutput(";\n\n");
    
    //console.log("Output", JSON.stringify(model, null, "  "));
    addOutput("// All the data collected by the project\n");
    addOutput("var data = " + JSON.stringify(model, null, "    "));
    addOutput(";\n\n");

    var unusedTypes2 = {};
    
    var moreModels = [];
    for (pageIndex in pages) {
        page = pages[pageIndex];
        if (page.type !== "page") {
            var model2 = {};
            moreModels.push(model2);
            model2.__id = page.id;
            model2.__type = page.type;
            // console.log("page", page.type, page);
            for (questionIndex in page.questions) {
                question = page.questions[questionIndex];
                if (modelTypes[question.type]) {
                    // console.log("question", question.id, question.type);
                    if (question.type === "grid") {
                        model2[question.id] = [];
                    } else if (question.type === "text" || question.type === "textarea") {
                        model2[question.id] = "";
                    } else {
                        model2[question.id] = null;
                    }
                } else {
                    unusedTypes2[question.type] = 1;
                }
            }
        }
    }
    for (var key2 in unusedTypes2) {
        console.log("unusedType2 for model: ", key2);
    }
    
    // console.log("Output", JSON.stringify(moreModels, null, "  "));
    addOutput("var other = " + JSON.stringify(moreModels, null, "    "));
    addOutput(";\n\n");
}

function writeAllPagesSummaryFile() {
    allOutput = "";
    addOutput("// Generated from design\n");
    addOutput("\"use strict\";\n");
    addOutput("\ndefine(function() {\n\n");
    
    outputModel();
    
    addOutput("return {\n");
    addOutput("    \"pagesToGoWithHeaders\": pagesToGoWithHeaders,\n");
    addOutput("    \"data\": data,\n");
    addOutput("    \"other\": other\n");
    addOutput("};\n");
    addOutput("});\n");
    
    fs.writeFile(allPagesSummaryFileName, allOutput, errorHandler(allPagesSummaryFileName));
}

function writeFiles() {
    writePageFiles() ;
    writeAllPagesFile();
    writeTranslationsFile();
    writeAllPagesSummaryFile();
}

writeFiles();
