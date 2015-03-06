/*jslint node: true */
"use strict";

// Generate initial recommendations table file

// var recommendationsFileName = '../design/recommendations.csv';
var recommendationsFileName = '../design/recommendations_generated.csv';

var fs = require('fs');

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}

var parseDesign = require("./parse-design.js");
var pages = parseDesign.pages;

var allOutput = "";

function addOutput(output) {
  allOutput = allOutput + output;
}

var categories = {
  "Eliciting questions": [],
  "storyQuestions": ["choice","range","free text"],
  "participantQuestions": [],
  "Venues": ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories"],
  "collectionSessions": [],
  "sensemakingSessions": [],
  "interventions": []
};

function quote(item) {
    return '"' + item + '"';
}

function generateRecommendationsTable() {
    var header = '';
    for (var categoryName in categories) {
        if (header) header = header + ',';
        header = header + ',' + quote('# ' + categoryName);
        var fieldNames = categories[categoryName];
        for (var fieldNameIndex in fieldNames) {
            var fieldName = fieldNames[fieldNameIndex];
            header = header + ',' + quote(fieldName);
        }
    }
    addOutput(header);
    
    for (var pageIndex in pages) {
        var page = pages[pageIndex];
        for (var questionIndex in page.questions) {
            var question = page.questions[questionIndex];
            if ((startsWith(question.id, 'participantGroup_') || startsWith(question.id, 'aboutYou_')) && (question.type === 'select')) {
                var optionsSplit = [];
                if (question.options) {
                    optionsSplit = question.options.split(";");
                }
                addOutput('\n' + quote('# ' + question.id) + '\n');
                // TODO: Just don't make a recommendation if unanswered? addOutput(quote("unanswered") + '\n');
                for (var optionIndex in optionsSplit) {
                    var option = optionsSplit[optionIndex];
                    addOutput(quote(option) + '\n');
                }
            }
        }
    }  
}

generateRecommendationsTable();
console.log("Output", allOutput);
fs.writeFileSync(recommendationsFileName, allOutput);