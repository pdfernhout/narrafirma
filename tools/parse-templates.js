/*jslint node: true */
"use strict";

// This parses design/design_pages_notes.txt to create a pages structure with an object for each page that contains questions for that page.

// The design file to be read
var templateFileName = '../design/templates.txt';
var allTemplatesFileName = '../WebContent/js/templates/templates.js';

var fs = require('fs');

function startsWith(str, prefix) {
    // console.log("startsWith", prefix, str.lastIndexOf(prefix, 0) === 0, str);
  return str.lastIndexOf(prefix, 0) === 0;
}
  
function isString(something) {
  return (typeof something === 'string' || something instanceof String);
}

var acceptableTypes = [
  "text", "textarea", "label", "header", "select", "grid", "button",
  "popup", "imageUploader", "recommendationTable", "questionsTable", "quizScoreResult",
  "report", "checkboxes", "templateList", "checkboxesWithPull", "participantStoryForm", "storyBrowser",
  "excerptsList", "storyThemer", "graphBrowser", "trendsReport", "clusterSpace", "listCount",
  "questionAnswer", "questionAnswerCountOfTotalOnPage", "toggleButton", "boolean",
  "observationsList", "image", "function",
  "accumulatedItemsGrid", "annotationsGrid", "storiesList",
  "slider"
];

// TODO: List types not used from acceptable types

var usedIDs = {};
var templates = [];

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
  if (lineContentSections.length === 2) {
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
  if (infoContentSplit.length === 4) {
      infoContent.shortName = infoContentSplit[1];
      if (startsWith(infoContent.shortName, '"')) {
          infoContent.shortName = JSON.parse(infoContent.shortName);
      }
      infoContent.type = infoContentSplit[2];
      infoContent.options = infoContentSplit[3];
  }
  if (infoContentSplit.length >= 5) console.log("FIX NEEDED: Expected only up to four sections in brackets for line: " + lineNumber + " :: " + line);
  
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
  // console.log("convert");
  // console.log("input", input);
  
  usedIDs = {};
  
  var lines = input.split("\n");
  var lastPage = null;
  var lastQuestion = null;
  templates = [];
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
              if (!lastPage.type) lastPage.type = "page";
              templates.push(lastPage);
              commentNumberInPage = 0;
          }
      } else if (lastPage && startsWith(line, "*")) {
          rest = line.substring(1);
          // A question
          data = extract(line, rest, lineNumber);
          if (data) {
              if (!data.info.type) {
                  // console.log("WARNING: no type for line: " + lineNumber + " :: " + line);
                  data.info.type = "label";
              }
              
              if (acceptableTypes.indexOf(data.info.type) === -1) {
                  console.log("WARNING: Unexpected type '" + data.info.type + "' for line: " + lineNumber + " :: " + line);
              }
              lastQuestion = {"id": data.info.id, "text": data.text, shortName: data.info.shortName, "category": data.shortText, "type": data.info.type, "options": data.info.options};
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

}

var allOutput = "";

function addOutput(output) {
  allOutput = allOutput + output;
}

function writeTemplatesModule() {
    allOutput = "";
    addOutput("// Generated from design\n");
    addOutput("\ndefine(function() {\n");
    addOutput("    \"use strict\";\n");    
    addOutput("\n  var templates = ");
    addOutput(JSON.stringify(templates, null, 4));
    addOutput(";\n");
    addOutput("  \n");    
    addOutput("  function convertSemicolonsToNewlinesForOptions(section) {\n");
    addOutput("      var questions = section.questions;\n");
    addOutput("      for (var questionIndex in questions) {\n");
    addOutput("          var question = questions[questionIndex];\n");
    addOutput("          if (question.options) {\n");
    addOutput("              question.options = question.options.replace(/;/g, \"\\n\");\n");
    addOutput("              // console.log(\"new options\", question.options);\n");
    addOutput("          }\n");
    addOutput("      }\n");
    addOutput("      return section;\n");
    addOutput("  }\n");
    addOutput("\n");
    addOutput("  return {\n");
    addOutput("    \"elicitationQuestions\": convertSemicolonsToNewlinesForOptions(templates[0]),\n");
    addOutput("    \"storyQuestions\": convertSemicolonsToNewlinesForOptions(templates[1]),\n");
    addOutput("    \"participantQuestions\": convertSemicolonsToNewlinesForOptions(templates[2])\n");
    addOutput("  };\n");
    addOutput("});\n");
    
    fs.writeFileSync(allTemplatesFileName, allOutput);
    
    console.log("wrote templates module", allTemplatesFileName);
}

// Read design file
console.log("Reading template file:", templateFileName);
var templateData = fs.readFileSync(templateFileName, "utf8");

// convert it to pages
convert(templateData);

// console.log("templates", JSON.stringify(templates, null, 2));

// exports.templates = templates

writeTemplatesModule();
