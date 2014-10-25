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

var modelTypes = {
      text: 1,
      textarea: 1,
      boolean: 1,
      select: 1,
      imageUploader: 1,
      toggleButton: 1,
      checkBoxes: 1,
      checkBoxesWithPull: 1,
      excerptsList: 1,
      grid: 1,
      annotationsGrid: 1,
      accumulatedItemsGrid: 1,
      storyBrowser: 1,
      storyThemer: 1,
      graphBrowser: 1,
      clusterSpace: 1,
      quizScoreResult: 1,
      report: 1
};

function generateModel() {
  var unusedTypes = {};
  var model = {};
  var pagesToGoWithHeaders = {};
  var lastHeader = null;
  pages.forEach(function (page) {
      if (page.isHeader) {
          pagesToGoWithHeaders[page.id] = [];
          lastHeader = page.id;
      } else {
          pagesToGoWithHeaders[lastHeader].push(page.id);
      }
      if (!page.type) {
          // console.log("page", page);
          page.questions.forEach(function (question) {
              if (modelTypes[question.type]) {
                  console.log("question", question.id, question.type);
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
          });
      }
  });
  for (var key in unusedTypes) {
      console.log("unusedType: ", key);
  }
  console.log("Output", JSON.stringify(model, null, "  "));
  
  console.log("Pages to go with headers", JSON.stringify(pagesToGoWithHeaders, null, "  "));
  
  var unusedTypes2 = {};
  
  var moreModels = [];
  pages.forEach(function (page) {
      if (page.type) {
          var model2 = {};
          moreModels.push(model2);
          model2.__id = page.id;
          model2.__type = page.type;
          console.log("page", page.type, page);
          page.questions.forEach(function (question) {
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

// Main

convert(design);
// console.log("allOutput", allOutput);

if (allOutput) {
    fs.writeFile("WebContent/js/pages.js", allOutput, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The pages.js file was written.");
        }
    });
}