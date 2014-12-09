/*jslint node: true */
"use strict";

var recommendationsFileName = '../design/recommendations.csv';
// var recommendationsFileName = './recommendations-test.csv';
var recommendationsOutputFileName = '../WebContent/js/templates/recommendations.js';

// Process Recommendations CSV file 
// File should have category header line to define categories with "# SECTION" to define sections and blank items between sections
// Each row should have a header (# SECTION) or item with entries for every regular column with a blank line between sections
/* Example:
"",    "#C1", "Ven1", "Ven2", "", "#C2", "Way1", "Way2"
"#Q1",    "",     "",     "", "",    "",    "",      ""
"op1",    "",    "1",    "2", "",    "",   "2",     "1"
"op2",    "",    "3",    "4", "",    "",   "4",     "3"
   "",    "",     "",     "", "",    "",    "",      ""
"#Q2",    "",     "",     "", "",    "",    "",      ""
"op1",    "",    "1",    "4", "",    "",   "3",     "1"
"op2",    "",    "3",    "2", "",    "",   "4",     "1"
*/

/* The JSON output looks like:
{
  "Q1": {
    "op1": {
      "C1": {
        "Ven1": "1",
        "Ven2": "2"
      },
      "C2": {
        "Way1": "2",
        "Way2": "1"
      }
    },
    "op2": {
      "C1": {
        "Ven1": "3",
        "Ven2": "4"
      },
      "C2": {
        "Way1": "4",
        "Way2": "3"
      }
    }
  },
  "Q2": {
    "op1": {
      "C1": {
        "Ven1": "1",
        "Ven2": "4"
      },
      "C2": {
        "Way1": "3",
        "Way2": "1"
      }
    },
    "op2": {
      "C1": {
        "Ven1": "3",
        "Ven2": "2"
      },
      "C2": {
        "Way1": "4",
        "Way2": "1"
      }
    }
  }
}
*/

var fs = require('fs');

function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/*
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
*/

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

function loadMatrixFromCSVText(text) {
    // Load matrix
    matrix = [];
    matrixColumnCount = 0;
    matrixRowCount = 0;
    
    var lines = text.split("\n");
    // console.log(JSON.stringify(lines));
    
    for (var lineIndex in lines) {
        var line = lines[lineIndex];
        // TODO: Will not handle embedded commas or quotes
        var splitLine = line.split(",");
        var lineItems = [];
        for (var index in splitLine) {
            var item = splitLine[index].trim();
            if (startsWith(item, '"') && endsWith(item, '"')) {
                // console.log("trimming item '%s'", item);
                item = item.substring(1, item.length - 1);
            }
            lineItems.push(item);
        }
        
        matrix.push(lineItems);
        // if (lineItems.length > matrixColumnCount) matrixColumnCount = lineItems.length;
    }
    matrixRowCount = matrix.length;
    if (matrixRowCount > 0) matrixColumnCount = matrix[0].length;
    
    console.log("matrixColumnCount %s, matrixRowCount %s", matrixColumnCount, matrixRowCount);
    // console.log("matrix", JSON.stringify(matrix, null, 2));
    console.log("test retrieval 5,5", getMatrixValue(5, 5));
    console.log("test retrieval 6,3", getMatrixValue(6, 6));
}

function addRecommendation(recommendations, columnCategory, columnField, rowCategory, rowField, item) {
    var question = recommendations[rowCategory];
    if (!question) {
        question = {};
        recommendations[rowCategory] = question;
    }
    var option = question[rowField];
    if (!option) {
        option = {};
        question[rowField] = option;
    }
    var category = option[columnCategory];
    if (!category) {
        category = {};
        option[columnCategory] = category;
    }
    category[columnField] = item;
}

function processRecommendationsMatrix() {
    var header = matrix[0];
    var columnCategory = null;
    var columnField = null;
    var rowCategory = null;
    var rowField = null;
    
    var recommendations = {};
 
    for (var lineIndex = 1; lineIndex < matrixRowCount; lineIndex ++) {
        var line = matrix[lineIndex];
        rowField = getMatrixValue(lineIndex, 0).trim();
        if (rowField === "") continue;
        if (startsWith(rowField, "#")) {
            rowCategory = rowField.substring(1).trim();
            rowField = null;
            continue;
        }
        
        for (var columnIndex = 1; columnIndex <  matrixColumnCount; columnIndex++) {
            columnField = header[columnIndex].trim();
            if (columnField === "") continue;
            if (startsWith(columnField, "#")) {
                columnCategory = columnField.substring(1).trim();
                columnField = null;
                continue;
            }
            
            var item = getMatrixValue(lineIndex, columnIndex).trim();
            addRecommendation(recommendations, columnCategory, columnField, rowCategory, rowField, item);        
        }
    }
    return recommendations;
}

function buildQuestions() {
    var result = {};
    var rowCategory = null;
    var rowField = null;
 
    for (var lineIndex = 1; lineIndex < matrixRowCount; lineIndex ++) {
        var line = matrix[lineIndex];
        rowField = getMatrixValue(lineIndex, 0).trim();
        if (rowField === "") continue;
        if (startsWith(rowField, "#")) {
            rowCategory = rowField.substring(1).trim();
            rowField = null;
            result[rowCategory] = [];
            continue;
        }
        result[rowCategory].push(rowField);
    }
    return result;
}

function buildCategories() {
    var result = {};
    var columnCategory = null;
    var columnField = null;
    for (var columnIndex = 1; columnIndex <  matrixColumnCount; columnIndex++) {
        columnField = getMatrixValue(0, columnIndex).trim();
        if (columnField === "") continue;
        if (startsWith(columnField, "#")) {
            columnCategory = columnField.substring(1).trim();
            columnField = null;
            result[columnCategory] = [];
            continue;
        }
        result[columnCategory].push(columnField);
    }
    return result;
}

var allOutput = "";

function addOutput(output) {
  allOutput = allOutput + output;
}

function writeRecommendationsModule(recommendationsStructure) {
    allOutput = "";
    addOutput("// Generated from design\n");
    addOutput("\"use strict\";\n");
    addOutput("\ndefine(function() {\n");
    
    addOutput("\n  var recommendations = ");
    addOutput(JSON.stringify(recommendationsStructure, null, 4));
    addOutput(";\n");
    
    addOutput("\n  return recommendations;\n");
    addOutput("});\n");
    
    fs.writeFileSync(recommendationsOutputFileName, allOutput);
    
    console.log("wrote recommendations module", recommendationsOutputFileName);
}

console.log("Reading recommendations file:", recommendationsFileName);
var textOfRecommendations = fs.readFileSync(recommendationsFileName, "utf8");
loadMatrixFromCSVText(textOfRecommendations);
var categories = buildCategories();
var questions = buildQuestions();
var recommendations = processRecommendationsMatrix();
// console.log("recommendations", JSON.stringify(recommendations, null, 2));

var recommendationsStructure = {categories: categories, questions: questions, recommendations: recommendations};
// console.log("recommendationsStructure", JSON.stringify(recommendationsStructure, null, 2));
writeRecommendationsModule(recommendationsStructure);
