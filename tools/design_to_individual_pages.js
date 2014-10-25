"use strict";

// Run with node.js

var fs = require('fs');

// Read design file
var design = fs.readFileSync('design/design_pages_notes.txt', "utf8");

/*
fs.writeFile("WebContent/js/pages/test_nodejs_filewriting.txt", "Hello file!", function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
*/

function startsWith(str, prefix) {
    // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
  return str.lastIndexOf(prefix, 0) === 0;
}
  
function isString(something) {
  return (typeof something == 'string' || something instanceof String);
}

var acceptableTypes = [
  "text", "textarea", "label", "header", "select", "grid", "button",
  "popup", "imageUploader", "recommendationTable", "questionsTable", "quizScoreResult",
  "report", "checkBoxes", "templateList", "checkBoxesWithPull", "participantStoryForm", "storyBrowser",
  "excerptsList", "storyThemer", "graphBrowser", "trendsReport", "clusterSpace", "listCount",
  "questionAnswer", "questionAnswerCountOfTotalOnPage", "toggleButton", "boolean",
  "observationsList", "image"
];

var usedIDs = {};
var pages;

function extract(line, rest, lineNumber) {
  var lineSections = rest.split("[");
  if (lineSections.length !== 2) {
    console.log("FIX NEEDED: Expected two sections relating to opening bracket for line: " + lineNumber + " :: " + line);
    lineSections = [rest, "]"];
  }
  
  var lineContent = lineSections[0].trim();
  var lineContentSections = lineContent.split('|');
  var shortLineContent = null;
  var longLineContent = lineContent;
  if (lineContentSections.length == 2) {
         shortLineContent = lineContentSections[0].trim();
         longLineContent = lineContentSections[1].trim();
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
  
  var infoContentString = infoSections[0].trim();
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
  
  //if (infoContent.type && acceptableTypes.indexOf(infoContent.type) === -1) {
  //    console.log("FIX NEEDED: Unknown type '" + infoContent.type + "' in brackets for line: " + lineNumber + " :: " + line);
  //}
  
  if (!infoContent.id) {
      console.log("WARNING: No id for line: " + lineNumber + " :: " + line);
      infoContent.id = "FIXME_" + lineNumber;
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

function convert(input) {
  console.log("convert");
  // console.log("input", input);
  
  // Reset the list of IDs and output area in case the button is pressed twice without reloading
  usedIDs = {};
  allOutput = "";
  
  var lines = input.split("\n");
  var lastPage = null;
  var lastQuestion = null;
  pages = [];
  var lineNumber = 0;
  var commentNumberInPage = 0;
  var data;
  
  lines.forEach(function (line) {
      lineNumber++;
      // console.log("line", lineNumber, line);
      line = line.trim();

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
              if (!data.info.type) {
                  console.log("WARNING: no type for line: " + lineNumber + " :: " + line);
                  data.info.type = "label";
              }
              
              if (acceptableTypes.indexOf(data.info.type) === -1) {
                  console.log("WARNING: Unexpected type '" + data.info.type + "' for line: " + lineNumber + " :: " + line);
              }
              lastQuestion = {"id": data.info.id, "text": data.text, "shortText": data.shortText, "type": data.info.type, "options": data.info.options};
              lastPage.questions.push(lastQuestion);
          }
      } else if (lastPage && startsWith(line, "//")) {
          // console.log("comment line", line);
          // if (lastPage.description) lastPage.description += "\n";
          // lastPage.description += line;
          // lastQuestion = {"id": "COMMENT_" + lastPage.id + "_" + (++commentNumberInPage), "text": line, "type": "label", "options": null};
          // lastPage.questions.push(lastQuestion);
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

var allOutput = "";

function addOutput(output) {
  allOutput = allOutput + output;
}

// Main

convert(design);
// console.log("allOutput", allOutput);

var fileTemplate = "\"use strict\";\n" +
"\n" +
"define([\n" +
"    \"js/widgetBuilder\"\n" +
"], function(\n" +
"    widgets\n" +
") {\n" +
"\n" +
"    function addWidgets(contentPane, model) {\n" +
"{{body}}" +
"    }\n" +
"\n" +
"    return {\n" +
"        \"id\": \"{{pageID}}\",\n" +
"        \"name\": \"{{pageName}}\",\n" +
"        \"isHeader\": {{isHeader}},\n" +
"        \"addWidgets\": addWidgets\n" +
"    };\n" +
"});";

function errorHandler(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The test01.js file was written.");
    }
}

var folder = "WebContent/js/pages/";
for (var pageIndex in pages) {
    var page = pages[pageIndex];
    var fileName = folder + page.id + ".js";
    var fileContent = fileTemplate;
    fileContent = fileContent.replace("{{pageID}}", page.id);
    fileContent = fileContent.replace("{{pageName}}", page.name);
    fileContent = fileContent.replace("{{isHeader}}", page.isHeader);
    allOutput = "";
    for (var questionIndex in page.questions) {
        var question = page.questions[questionIndex];
        var options = question.options;
        if (!question.options) options = "";
        addOutput("        widgets.add_" + question.type + "(contentPane, \"" + question.id + "\", model, \"" + options + "\");\n");
    }
    
    fileContent = fileContent.replace("{{body}}", allOutput);
    fs.writeFile(fileName, fileContent, errorHandler);
    return;
}