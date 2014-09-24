"use strict";

// if get error loading file see this:
// http://stackoverflow.com/questions/10111864/dojo-require-not-working

require([
    "dojo/_base/array",
    "dojo/string",
    "dojo/text!../design/design_pages_notes.txt",
    "dojo/text!../design/recommendations.csv",
    "dijit/form/Button",
    "dojox/data/CsvStore",
    "dijit/form/SimpleTextarea",
    "dojo/domReady!"
], function(
    array,
    string,
    textOfDesign,
    textOfRecommendations,
    Button,
    CsvStore,
    SimpleTextarea
){
    
function startsWith(str, prefix) {
      // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
    return str.lastIndexOf(prefix, 0) === 0;
}
    
function isString(something) {
    return (typeof something == 'string' || something instanceof String);
}

function newButton(label, addToDiv, callback) {
    var button = new Button({
        label: label,
        type: "button",
        onClick: callback
    });
    if (isString(addToDiv)) {
        addToDiv = document.getElementById(addToDiv);
    }
    if (addToDiv) {
        button.placeAt(addToDiv);
    }
    // TODO: Is startup call really needed here?
    button.startup();
    return button.domNode;
}

var acceptableTypes = [
    "text", "textarea", "label", "header", "select", "grid", "button",
    "popup", "imageUploader", "recommendationTable", "questionsTable", "quizScoreResult",
    "report", "checkBoxes", "templateList", "checkBoxesWithPull", "participantStoryForm", "storyBrowser",
    "excerptsList", "storyThemer", "graphBrowser", "trendsReport", "clusterSpace", "listCount",
    "questionAnswer", "questionAnswerCountOfTotalOnPage", "toggleButton", "boolean",
    "observationsList"
];

var usedIDs = {};
var pages;
var inputTextArea;
var outputTextArea;

function extract(line, rest, lineNumber) {
    var lineSections = rest.split("[");
    if (lineSections.length !== 2) {
      console.log("FIX NEEDED: Expected two sections relating to opening bracket for line: " + lineNumber + " :: " + line);
      lineSections = [rest, "]"];
    }
    
    var lineContent = string.trim(lineSections[0]);
    var lineContentSections = lineContent.split('|');
    var shortLineContent;
    var longLineContent = lineContent;
    if (lineContentSections.length == 2) {
           shortLineContent = string.trim(lineContentSections[0]);
           longLineContent = string.trim(lineContentSections[1]);
       }
    if (lineContentSections.length >= 3) console.log("FIX NEEDED: Too many segments in line content: " + lineNumber + " :: " + line);
    
    var infoSections = lineSections[1].split("]");
    if (infoSections.length !== 2) {
      console.log("FIX NEEDED: Expected two sections relating to closing bracket for line: " + lineNumber + " :: " + line);
      infoSections = null;
    }
    
    if (!infoSections) {
        console.log("FIX NEEDED: Expected some content in brackets for line: " + lineNumber + " :: " + line);
        infoSections = ["FIXME_" + lineNumber];
    } else if (!infoSections[0]) {
        console.log("FIX NEEDED: Expected a non-empty id for line: " + lineNumber + " :: " + line);
        infoSections = ["FIXME_" + lineNumber];        
    }
    
    var infoContentString = string.trim(infoSections[0]);
    var infoContentSplit = infoContentString.split("|");
    var infoContent = {};
    if (infoContentSplit.length >= 1) infoContent.id = infoContentSplit[0];
    if (infoContentSplit.length >= 2) infoContent.type = infoContentSplit[1];
    if (infoContentSplit.length >= 3) infoContent.options = infoContentSplit[2];
    if (infoContentSplit.length >= 4) console.log("FIX NEEDED: Expected only up to three sections in brackets for line: " + lineNumber + " :: " + line);
    
    if (acceptableTypes.indexOf(infoContent.id) !== -1) {
      console.log("WARNING: Using widget type as question ID for line: " + lineNumber + " :: " + line);
      //if (!infoContent.type) infoContent.type = infoContent.id;
      //infoContent.id = "FIXME_" + lineNumber;
    }
    
    if (infoContent.type && acceptableTypes.indexOf(infoContent.type) === -1) {
        console.log("FIX NEEDED: Unknown type '" + infoContent.type + "' in brackets for line: " + lineNumber + " :: " + line);
    }
    
    var previousLineNumber = usedIDs[infoContent.id];
    if (previousLineNumber) {
        console.log("FIX NEEDED: Widget ID '" + infoContent.id + "' was previously used on line " + previousLineNumber + " and is redeclared on line: " + lineNumber + " :: " + line);
        infoContent.id = "FIXME_" + lineNumber;
    } else {
        usedIDs[infoContent.id] = lineNumber;
    }
    
    return {"text": longLineContent, "shortText": shortLineContent, "info": infoContent};
}

function convert() {
    console.log("convert", inputTextArea);
    var input = inputTextArea.get("value");
    // console.log(input);
    
    // Reset the list of IDs and output area in case the button is pressed twice without reloading
    usedIDs = {};
    outputTextArea.set("value", "");
    
    var lines = input.split("\n");
    var lastPage = null;
    var lastQuestion = null;
    pages = [];
    var lineNumber = 0;
    var commentNumberInPage = 0;
    var data;
    
    array.forEach(lines, function (line) {
        lineNumber++;
        // console.log("line", lineNumber, line);
        line = string.trim(line);

        var header = false;
        var rest = line;
        
        if (startsWith(line, "#")) {
            // A page or page section header
            if (startsWith(line, "##")) {
                // A page
                rest = line.substring(2);
            } else {
                // A page as a section header
                rest = line.substring(1);
                header = true;
            }
            lastQuestion = null;
            
            data = extract(line, rest, lineNumber);
            if (data) {
              lastPage = {"id": data.info.id, "name": data.text, "description": "", "isHeader": header, "type": data.info.type, "options": data.info.options, "questions": []};
              pages.push(lastPage);
              commentNumberInPage = 0;
            }
        } else if (lastPage && startsWith(line, "*")) {
            rest = line.substring(1);
            // A question
            data = extract(line, rest, lineNumber);
            if (data) {
              lastQuestion = {"id": data.info.id, "text": data.text, "shortText": data.shortText, "type": data.info.type, "options": data.info.options};
              lastPage.questions.push(lastQuestion);
            }
        } else if (lastPage && startsWith(line, "//")) {
            // console.log("comment line", line);
            // if (lastPage.description) lastPage.description += "\n";
            // lastPage.description += line;
            lastQuestion = {"id": "COMMENT_" + lastPage.id + "_" + (++commentNumberInPage), "text": line, "type": "label", "options": null};
            lastPage.questions.push(lastQuestion);
        } else if (lastQuestion && line) {
            if (lastQuestion.text) lastQuestion.text += "\n";
            lastQuestion.text += line;
        } else if (lastPage) {
            if (lastPage.description) lastPage.description += "\n";
            lastPage.description += line;
        }
        // console.log("line", header, stuff, name, "::", description);
    });
    
    addOutput('"use strict";\n');
    addOutput('define(\n');
    addOutput(JSON.stringify(pages, null, "    "));
    addOutput(');\n');
}

function generateRecommendationsTable() {
    if (!pages) console.log('Run convert before generating recommendations table');
    outputTextArea.set("value", "");
    array.forEach(pages, function (page) {
        array.forEach(page.questions, function (question) {
            if (startsWith(question.id, 'aspects_') && (question.type === 'select')) {
                addOutput('\n' + question.id + '\n');
                array.forEach(question.options.split(';'), function (option) {
                    addOutput('\t' + option + '\n');
                    // console.log(option);
                });
            }
        });
        
    });
    
}

function addOutput(output) {
    var newValue = outputTextArea.get("value") + output;
    outputTextArea.set("value", newValue);
}

function loadRecommendationsCSV() {
    inputTextArea.set("value", textOfRecommendations);
    outputTextArea.set("value", "");
    
    processRecommendationsCSV();
}


var matrix;
var matrixColumnCount;
var matrixRowCount;

function getMatrixValue(row, column) {
    if (row > matrixRowCount) return null;
    if (column > matrixColumnCount) return null;
    var line = matrix[row];
    // console.log("test1", column, line.length, line);
    if (column > line.length) return "";
    return line[column];
}

function loadMatrix() {
    // Load matrix
    matrix = [];
    matrixColumnCount = 0;
    matrixRowCount = 0;
    
    var lines = textOfRecommendations.split("\r");
    console.log(JSON.stringify(lines));
    var rowCategoriesSplit = lines[0].split(",");
    console.log(JSON.stringify(rowCategoriesSplit));
    
    for (var lineIndex in lines) {
        var line = lines[lineIndex];
        // TODO: Will not handle embedded commas or quotes
        var splitLine = line.split(",");
        matrix[lineIndex] = splitLine;
        if (splitLine.length > matrixColumnCount) matrixColumnCount = splitLine.length;
    }
    matrixRowCount = lines.length;
    console.log(matrixColumnCount, matrixRowCount, matrix);
    console.log("test retrieval 5.5", getMatrixValue(5, 5));
}

function processRecommendationsCSV() {
    // Process CSV file which has row categories line then row data line, then column category line, then column data line, then blank, then repeate columns
    
    // Store did not seem to load data carrectly based on line breaks not processed correctly despite changing them to \n; also could not find URL
    //var fixedNewlinesText = textOfRecommendations.replace(/\r?\n/g, "\n");
    // console.log("fixedNewlinesText", fixedNewlinesText);
    // var store = new CsvStore({data: fixedNewlinesText});
    // var store = new CsvStore({url: "file:../design/recommendations.csv"});
    //console.log("store", store);
    
    loadMatrix();
    
    var rowCategories = [];
    var columnCategories = [];
    
    

}

var modelTypes = {
        text: 1,
        textarea: 1,
        boolean: 1,
        select: 1,
        grid: 1,
        imageUploader: 1,
        toggleButton: 1,
        checkBoxes: 1,
        checkBoxesWithPull: 1
};

function generateModel() {
    var unusedTypes = {};
    var model = {};
    array.forEach(pages, function (page) {
        if (!page.type) {
            // console.log("page", page);
            array.forEach(page.questions, function (question) {
                if (modelTypes[question.type]) {
                    console.log("question", question.id, question.type);
                    if (question.type === "grid") {
                        model[question.id] = [];
                    } else if (question.type === "text" || question.type === "textarea") {
                        model[question.id] = "";
                    } else {
                        model[question.id] = null;
                    }
                } else {
                    unusedTypes[question.type] = 1;
                }
            });
        }
    });
    for (var key in unusedTypes) {
        console.log("unusedType: ", key);
    }
    console.log("Output", JSON.stringify(model, null, "  "));
    
    var unusedTypes2 = {};
    
    var moreModels = [];
    array.forEach(pages, function (page) {
        if (page.type) {
            var model2 = {};
            moreModels.push(model2);
            model2.__id = page.id;
            model2.__type = page.type;
            console.log("page", page.type, page);
            array.forEach(page.questions, function (question) {
                if (modelTypes[question.type]) {
                    console.log("question", question.id, question.type);
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
            });
        }
    });
    for (var key2 in unusedTypes2) {
        console.log("unusedType2: ", key2);
    }
    console.log("Output", JSON.stringify(moreModels, null, "  "));

}

function createLayout() {
    var initialText = textOfDesign;
    
    inputTextArea = new SimpleTextarea({
        name: "input",
        value: initialText,
        style: "width: 90%; height: 200px"
    }, "input");
    
    inputTextArea.startup();  
    
    outputTextArea = new SimpleTextarea({
        name: "output",
        value: "",
        style: "width: 90%; height: 200px"
    }, "output");
    
    outputTextArea.startup();          
    
    newButton("Convert", "buttons", convert);
    newButton("Generate recommendations table", "buttons", generateRecommendationsTable);
    
    newButton("Load recommendations.csv", "buttons", loadRecommendationsCSV);
    
    newButton("Generate model", "buttons", generateModel);
}

createLayout();
});
