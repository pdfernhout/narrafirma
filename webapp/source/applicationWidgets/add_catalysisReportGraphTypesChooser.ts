import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportGraphTypesChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    var allGraphTypes = {
        "bar graphs": true,
        "histograms": true,
        "tables": true,
        "multiple histograms": true,
        "scatterplots": true,
        "contingency-histogram tables": true,
        "multiple scatterplots": true,
        "data integrity graphs": true,
        "texts": true,
    }
    
    var graphTypesToDisplayNamesMap = {
        "bar graphs": "choices (bar graphs)",
        "histograms": "scales (histograms)",
        "tables": "choice x choice combinations (contingency tables)",
        "multiple histograms": "scale x choice combinations (side-by-side histograms)",
        "scatterplots": "scale x scale combinations (scatterplots)",
        "contingency-histogram tables": "choice x choice x scale combinations (contingency-histogram tables)",
        "multiple scatterplots": "scale x scale x choice combinations (side-by-side scatterplots)",
        "data integrity graphs": "data integrity graphs",
        "texts": "texts",
    }

    var graphTypesToSingularDisplayNamesMap = {
        "bar graphs": "choice (bar graph)",
        "histograms": "scale (histogram)",
        "tables": "choice x choice combination (contingency table)",
        "multiple histograms": "scale x choice combination (side-by-side histograms)",
        "scatterplots": "scale x scale combination (scatterplot)",
        "contingency-histogram tables": "choice x choice x scale combination (contingency-histogram table)",
        "multiple scatterplots": "scale x scale x choice combination (side-by-side scatterplots)",
        "data integrity graphs": "data integrity graph",
        "texts": "text",
    }
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }

    function buildQuestionCheckbox(aName, id, count): any {
        const spaceAfter = [
            "scales (histograms)", 
            "scale x scale combinations (scatterplots)",
            "scale x scale x choice combinations (side-by-side scatterplots)"
        ].indexOf(aName) >= 0;

        var nameToDisplay;
        if (count == 1) {
            nameToDisplay = "" + count + " " + graphTypesToSingularDisplayNamesMap[id];
        } else {
            nameToDisplay = "" + count + " " + aName;
        }

        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, nameToDisplay),
            m("br"),
            spaceAfter ? m("br") : ""
        ]);
    }
    
    function selectAll() {
        storageFunction(allGraphTypes);
    }
    
    function clearAll() {
        storageFunction({});
    }

    var allGraphTypesAsArray = Object.keys(allGraphTypes);

    var questions = project.allQuestionsThatCouldBeGraphedForCatalysisReport(catalysisReportIdentifier);
    var graphTypesToCreate = project.graphTypesToCreate(catalysisReportIdentifier);
    var graphMultiChoiceQuestionsAgainstThemselves = project.tripleStore.queryLatestC(catalysisReportIdentifier, "graphMultiChoiceQuestionsAgainstThemselves");
    var totalGraphCount = 0;

    // TODO: Translate
    return m("div.questionExternal", [
        prompt,
        m("div", [
            m("br"),  
            allGraphTypesAsArray.map((graphType) => {
                var count = graphCountForGraphType(graphType, questions, graphMultiChoiceQuestionsAgainstThemselves);
                var result = buildQuestionCheckbox(graphTypesToDisplayNamesMap[graphType], graphType, count);
                if (graphTypesToCreate[graphType]) totalGraphCount += count;
                return result;
            }),
        ]),
    m("br"),
    m("button", { onclick: selectAll }, "Select all"),
    m("button", { onclick: clearAll }, "Clear all"),
    m("br"),
    m("p" + tipStyleForGraphCount(totalGraphCount), tipForGraphCount(totalGraphCount))
    ]);
}

function tipForGraphCount(totalGraphCount) {
    var tip;
    if (totalGraphCount < 5000) {
        tip = "You have selected a total of " + totalGraphCount + " graphs."
    } else if (totalGraphCount < 10000) {
        tip = "You have selected a total of " + totalGraphCount + " graphs. If the Explore patterns page loads slowly, choose fewer graph types and/or questions."
    } else if (totalGraphCount < 50000) {
        tip = "You have selected a total of " + totalGraphCount + " graphs. This will cause the Explore patterns page to load VERY slowly. You might want to choose fewer graph types and/or questions."
    } else {
        tip = "You have selected a total of " + totalGraphCount + " graphs. This will probably cause your browser to stop responding when you open the Explore patterns page. You should choose fewer graph types and/or questions."
    }
    return tip;
}

function tipStyleForGraphCount(totalGraphCount) {
    var tipStyle;
    if (totalGraphCount < 5000) {
        tipStyle = "[style=margin-left:1em]";
    } else if (totalGraphCount < 10000) {
        tipStyle = "[style=margin-left:1em]";
    } else if (totalGraphCount < 50000) {
        tipStyle = "[style=margin-left:1em;font-weight:bold]";
    } else {
        tipStyle = "[style=margin-left:1em;font-weight:bold;color:red]";
    }
    return tipStyle;
}

// Question types that have data associated with them for filters and graphs
var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

function graphCountForGraphType(graphType, questions, graphMultiChoiceQuestionsAgainstThemselves) {
    if (!questions) return 0;

    if (graphType === "data integrity graphs") {
        return 5; // change if add more data integrity graphs
    }

    var graphCount = 0;

    if (graphType === "texts") {
        questions.forEach((question) => {
            if (question.displayType === "text" || question.displayType === "textarea") {
                graphCount++;
            }
        });
        return graphCount;
    }
    
    var nominalQuestions = [];
    questions.forEach((question) => {
        if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            nominalQuestions.push(question);
        }
    });

    if (graphType === "bar graphs") {
        return nominalQuestions.length;
    }
    
    var scaleQuestions = [];
    questions.forEach((question) => {
        if (question.displayType === "slider") {
            scaleQuestions.push(question);
        }
    });

    if (graphType === "histograms") {
        return scaleQuestions.length;
    }
 
    // when creating question combinations, prevent mirror duplicates (axb, bxa) and self-matching questions (axa)
    // unless they want axa for multi-choice questions
    var usedQuestions;
    // two choice questions
    if (graphType === "tables") {
        usedQuestions = [];
        nominalQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            nominalQuestions.forEach((question2) => {
                var okayToGraphQuestionAgainstItself = graphMultiChoiceQuestionsAgainstThemselves && question2.displayType === "checkboxes";
                if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                graphCount++;
            });
        });
        return graphCount;
    };

    // two scale questions
    if (graphType === "scatterplots") {
        usedQuestions = [];
        scaleQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            scaleQuestions.forEach((question2) => {
                if (usedQuestions.indexOf(question2) !== -1) return;
                graphCount++;
            });
        });
        return graphCount;
    };

    // one scale question, one choice question
    if (graphType === "multiple histograms") {
        return scaleQuestions.length * nominalQuestions.length;
    }

    // two choice questions, one scale question
    if (graphType === "contingency-histogram tables") {
        usedQuestions = [];
        nominalQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            nominalQuestions.forEach((question2) => {
                var okayToGraphQuestionAgainstItself = graphMultiChoiceQuestionsAgainstThemselves && question2.displayType === "checkboxes";
                if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                scaleQuestions.forEach((question3) => {
                    graphCount++;
                });
            });
        });
        return graphCount;
    }

    // two scale questions, one choice question
    if (graphType === "multiple scatterplots") {
        usedQuestions = [];
        scaleQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            scaleQuestions.forEach((question2) => {
                if (usedQuestions.indexOf(question2) !== -1) return;
                nominalQuestions.forEach((question3) => {
                    graphCount++;
                });
            });
        });
        return graphCount;
    }

    console.log("ERROR: Unexpected graph type", graphType);
    alert("ERROR: Unexpected graph type: " + graphType);
}

export = add_catalysisReportGraphTypesChooser;
