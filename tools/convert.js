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

var inputTextArea = null;
var outputTextArea = null;

// TODO: Modularize convert code now in design_to_individual_pages.js so can call from here to create pages
var pages = [];

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


var matrix = [];
var matrixColumnCount = 0;
var matrixRowCount = 0;

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
    
    newButton("Generate recommendations table", "buttons", generateRecommendationsTable);
    
    newButton("Load recommendations.csv", "buttons", loadRecommendationsCSV);    
}

createLayout();
});
