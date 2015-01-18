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
    
    // Startup is needed here as for this file, the button is added immediately to the visual hierarchy
    button.startup();
    return button.domNode;
}

var inputTextArea = null;
var outputTextArea = null;

function addOutput(output) {
    var newValue = outputTextArea.get("value") + output;
    outputTextArea.set("value", newValue);
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
    
    // newButton("Generate recommendations table", "buttons", generateRecommendationsTable);
    
    // newButton("Load recommendations.csv", "buttons", loadRecommendationsCSV);    
}

createLayout();
});
