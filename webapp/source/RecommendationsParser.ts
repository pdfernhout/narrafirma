import kludgeForUseStrict = require("./kludgeForUseStrict");
"use strict";

// Process Recommendations CSV file 
// File should have category header line to define categories with "# SECTION" to define sections and blank items between sections
// Each row should have a header (# SECTION) or item with entries for every regular column with a blank line between sections
/* Example:
"",    "#Q1", "a1", "a2", "", "#Q2", "a1", "a2"
"#C1",    "",   "",   "", "",    "",   "",   ""
"op1",    "",  "1",  "2", "",    "",  "2",  "1"
"op2",    "",  "3",  "4", "",    "",  "4",  "3"
   "",    "",   "",   "", "",    "",   "",   ""
"#C2",    "",   "",   "", "",    "",   "",   ""
"op1",    "",  "1",  "4", "",    "",  "3",   "1"
"op2",    "",  "3",  "2", "",    "",  "4",   "1"
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

function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

class RecommendationsParser {
    static recommendationsObject: RecommendationsParser;
    static recommendationsInterventionObject: RecommendationsParser;
    
    matrix = [];
    matrixColumnCount = 0;
    matrixRowCount = 0;
    
    categories = null;
    questions = null;
    recommendations = null;

    getMatrixValue(row, column) {
        if (row > this.matrixRowCount) return null;
        if (column > this.matrixColumnCount) return null;
        const line = this.matrix[row];
        if (column > line.length) return "";
        return line[column];
    }

    loadMatrixFromCSVText(csvText) {
        // Load matrix
        this.matrix = [];
        this.matrixColumnCount = 0;
        this.matrixRowCount = 0;
        
        const lines = csvText.split("\r");
        for (const lineIndex in lines) {
            const line = lines[lineIndex];
            // TODO: Will not handle embedded commas
            const splitLine = line.split(",");
            const lineItems = [];
            for (let index = 0; index < splitLine.length; index++) {
                let item = splitLine[index].trim();
                if (startsWith(item, '"') && endsWith(item, '"')) {
                    item = item.substring(1, item.length - 1);
                    // Replace escaped double quotes
                    item = item.replace(/\"\"/, '"');
                }
                lineItems.push(item);
            }
            
            this.matrix.push(lineItems);
            // if (lineItems.length > matrixColumnCount) matrixColumnCount = lineItems.length;
        }
        this.matrixRowCount = this.matrix.length;
        if (this.matrixRowCount > 0) this.matrixColumnCount = this.matrix[0].length;
    }

    addRecommendation(recommendations, columnCategory, columnField, rowCategory, rowField, item) {
        let question = recommendations[columnCategory];
        if (!question) {
            question = {};
            recommendations[columnCategory] = question;
        }
        let option = question[columnField];
        if (!option) {
            option = {};
            question[columnField] = option;
        }
        let category = option[rowCategory];
        if (!category) {
            category = {};
            option[rowCategory] = category;
        }
        category[rowField] = item;
    }

    processRecommendationsMatrix() {
        const header = this.matrix[0];
        let columnCategory = null;
        let columnField = null;
        let rowCategory = null;
        let rowField = null;
        
        const recommendations = {};
     
        for (let lineIndex = 1; lineIndex < this.matrixRowCount; lineIndex ++) {
            const line = this.matrix[lineIndex];
            rowField = this.getMatrixValue(lineIndex, 0).trim();
            if (rowField === "") continue;
            if (startsWith(rowField, "#")) {
                rowCategory = rowField.substring(1).trim();
                if (rowCategory === "collectionSessions #sensemakingSessions") rowCategory = "sessions";
                rowField = null;
                continue;
            }
            
            for (let columnIndex = 1; columnIndex <  this.matrixColumnCount; columnIndex++) {
                columnField = header[columnIndex].trim();
                if (columnField === "") continue;
                if (startsWith(columnField, "#")) {
                    columnCategory = columnField.substring(1).trim();
                    columnField = null;
                    continue;
                }
                
                const item = this.getMatrixValue(lineIndex, columnIndex).trim();
                this.addRecommendation(recommendations, columnCategory, columnField, rowCategory, rowField, item);        
            }
        }
        return recommendations;
    }

    buildCategories() {
        const result = {};
        let rowCategory = null;
        let rowField = null;
     
        for (let lineIndex = 1; lineIndex < this.matrixRowCount; lineIndex ++) {
            const line = this.matrix[lineIndex];
            rowField = this.getMatrixValue(lineIndex, 0).trim();
            if (rowField === "") continue;
            if (startsWith(rowField, "#")) {
                rowCategory = rowField.substring(1).trim();
                if (rowCategory === "collectionSessions #sensemakingSessions") rowCategory = "sessions";
                rowField = null;
                result[rowCategory] = [];
                continue;
            }
            result[rowCategory].push(rowField);
        }
        return result;
    }

    buildQuestions() {
        const result = {};
        let columnCategory = null;
        let columnField = null;
        for (let columnIndex = 1; columnIndex <  this.matrixColumnCount; columnIndex++) {
            columnField = this.getMatrixValue(0, columnIndex).trim();
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
    
    parse(csvText: string) {
        this.loadMatrixFromCSVText(csvText);
        this.categories = this.buildCategories();
        this.questions = this.buildQuestions();
        this.recommendations = this.processRecommendationsMatrix();
    }
    
    constructor(csvText: string) {
        this.parse(csvText);
    }
    
    static recommendations() {
        // Lazy parsing of recommendations
        if (!RecommendationsParser.recommendationsObject) {
            const recommendationsText = window["narraFirma_recommendationsText"];
            RecommendationsParser.recommendationsObject = new RecommendationsParser(recommendationsText);
        }
        
        return RecommendationsParser.recommendationsObject;
    }
    
    static recommendationsIntervention() {
        // Lazy parsing of recommendations
        if (!RecommendationsParser.recommendationsInterventionObject) {
            const recommendationsInterventionText = window["narraFirma_recommendationsInterventionText"];
            RecommendationsParser.recommendationsInterventionObject = new RecommendationsParser(recommendationsInterventionText);
        }
        
        return RecommendationsParser.recommendationsInterventionObject;
    }
}

export = RecommendationsParser;