"use strict";

require([
    "dojo/_base/array",
    "dojo/string",
    "dojo/text!../design/design_pages_notes.txt",
    "dijit/form/Button",
    "dijit/form/SimpleTextarea",
    "dojo/domReady!"
], function(
	array,
	string,
	textOfDesign,
    Button,
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

var acceptableTypes = ["text", "textarea", "label", "header", "select", "grid", "button",
                       "popup", "imageUploader", "recommendationTable", "questionsTable", "quizScoreResult"];

var usedIDs = {};

function extract(line, rest, lineNumber) {
    var lineSections = rest.split("[");
    if (lineSections.length !== 2) {
      console.log("FIX NEEDED: Expected two sections relating to opening bracket for line: " + lineNumber + " :: " + line);
      lineSections = [rest, "]"];
    }
    
    var lineContent = string.trim(lineSections[0]);
    var lineContentSections = lineContent.split('|');
    var shortLineContent = undefined;
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
    
    if (!infoSections || !infoSections[0]) infoSections = ["FIXME_" + lineNumber];
    
    var infoContentString = string.trim(infoSections[0]);
    var infoContentSplit = infoContentString.split("|");
    var infoContent = {};
    if (infoContentSplit.length >= 1) infoContent.id = infoContentSplit[0];
    if (infoContentSplit.length >= 2) infoContent.type = infoContentSplit[1];
    if (infoContentSplit.length >= 3) infoContent.options = infoContentSplit[2];
    if (infoContentSplit.length >= 4) console.log("FIX NEEDED: Expected only up to there sections in brackets for line: " + lineNumber + " :: " + line);
    
    if (acceptableTypes.indexOf(infoContent.id) !== -1) {
      console.log("FIX NEEDED: Expected valid ID as first entry in brackets for line: " + lineNumber + " :: " + line);
      if (!infoContent.type) infoContent.type = infoContent.id;
      infoContent.id = "FIXME_" + lineNumber;
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

var pages;

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
    	  
    	  var data = extract(line, rest, lineNumber);
    	  if (data) {
	        lastPage = {"id": data.info.id, "name": data.text, "lineNumber": lineNumber, "description": "", "isHeader": header, "type": data.info.type, "options": data.info.options, "questions": []};
	        pages.push(lastPage)
    	  }
      } else if (lastPage && startsWith(line, "*")) {
    	  rest = line.substring(1);
    	  // A question
        var data = extract(line, rest, lineNumber);
        if (data) {
          lastQuestion = {"id": data.info.id, "text": data.text, "shortText": data.shortText, "type": data.info.type, "options": data.info.options};
          lastQuestion.lineNumber = lineNumber;
          lastPage.questions.push(lastQuestion)  
        }
      } else if (lastPage && startsWith(line, "//")) {
    	  // console.log("comment line", line);
    	  // if (lastPage.description) lastPage.description += "\n";
        // lastPage.description += line;
        lastQuestion = {"id": "FIXME_" + lineNumber, "text": line, "type": "label", "options": null};
        lastQuestion.lineNumber = lineNumber;
        lastPage.questions.push(lastQuestion)  
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
    addOutput(');\n')
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

var inputTextArea;
var outputTextArea;

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
}

createLayout();
});
