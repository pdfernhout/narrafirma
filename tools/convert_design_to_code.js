"use strict";

// Run with node.js
// This generates various files with code derived from design/design_pages_notes.txt
// It generates "page_*" files in the js/pages folder to correspond with each page.
// It generates js/pages/allPages.js which has a structure with all the pages
// It generates and allPagesSummary.js which defines the domain data model and also has information about what pages go with what headers
// It generates js/nls/pageMessages.js translation file

var fs = require('fs');

// Read design file
var design = fs.readFileSync('design/design_pages_notes.txt', "utf8");

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
  "report", "checkboxes", "templateList", "checkboxesWithPull", "participantStoryForm", "storyBrowser",
  "excerptsList", "storyThemer", "graphBrowser", "trendsReport", "clusterSpace", "listCount",
  "questionAnswer", "questionAnswerCountOfTotalOnPage", "toggleButton", "boolean",
  "observationsList", "image"
];

var usedIDs = {};
var pages = [];

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
              if (!lastPage.type) lastPage.type = "page";
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
"        \"name\": \"{{pageName}}\",\n" +
"        \"type\": \"{{pageType}}\",\n" +
"        \"isHeader\": {{isHeader}},\n" +
"        \"questions\": questions,\n" +
"        \"buildPage\": buildPage\n" +
"    };\n" +
"});";

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

var folder = "WebContent/js/pages/";
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
    var fileName = folder + page.id + ".js";
    var fileContent = fileTemplate;
    fileContent = fileContent.replace("{{pageID}}", page.id);
    fileContent = fileContent.replace("{{pageName}}", page.name);
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

// write allPages file

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

var allPagesFileContent = allPagesFileTemplate;
allPagesFileContent = allPagesFileContent.replace("{{pageFileNames}}", pageFileNames);
allPagesFileContent = allPagesFileContent.replace("{{pageNames}}", pageNames);
allPagesFileContent = allPagesFileContent.replace("{{pageReturn}}", pageReturn);

var allPagesFileName = "WebContent/js/pages/allPages.js";
fs.writeFile(allPagesFileName, allPagesFileContent, errorHandler(allPagesFileName));

//  write translations file

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

var translationFileName = "WebContent/js/nls/pageMessages.js";
fs.writeFile(translationFileName, allOutput, errorHandler(translationFileName));

//////

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
            }
        }
    }
    for (var key in unusedTypes) {
        console.log("unusedType: ", key);
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
            console.log("page", page.type, page);
            for (questionIndex in page.questions) {
                question = page.questions[questionIndex];
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
            }
        }
    }
    for (var key2 in unusedTypes2) {
        console.log("unusedType2: ", key2);
    }
    
    // console.log("Output", JSON.stringify(moreModels, null, "  "));
    addOutput("var other = " + JSON.stringify(moreModels, null, "    "));
    addOutput(";\n\n");
}

allOutput = "";
addOutput("// Generated from design\n");
addOutput("\"use strict\";\n");
addOutput("\ndefine(function() {\n\n");

generateModel();

addOutput("return {\n");
addOutput("    \"pagesToGoWithHeaders\": pagesToGoWithHeaders,\n");
addOutput("    \"data\": data,\n");
addOutput("    \"other\": other\n");
addOutput("};\n");
addOutput("});\n");

var allPagesSummaryFileName = "WebContent/js/pages/allPagesSummary.js";
fs.writeFile(allPagesSummaryFileName, allOutput, errorHandler(allPagesSummaryFileName));
