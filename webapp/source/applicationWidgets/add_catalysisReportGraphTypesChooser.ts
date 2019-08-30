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

    const allGraphTypes = {
        "bar graphs": true,
        "histograms": true,
        "tables": true,
        "multiple histograms": true,
        "scatterplots": true,
        "contingency-histogram tables": true,
        "multiple scatterplots": true,
        "correlation maps": true,
        "data integrity graphs": true,
        "texts": true,
    }

    const allGraphTypesThumbnailNames = {
        "bar graphs": "barGraphs",
        "histograms": "histograms",
        "tables": "tables",
        "multiple histograms": "multiHistograms",
        "scatterplots": "scatterPlots",
        "contingency-histogram tables": "contingencyHistograms",
        "multiple scatterplots": "multiScatterPlots",
        "correlation maps": "correlationMaps",
        "data integrity graphs": "dataIntegrity",
        "texts": "texts",
    }
    
    const graphTypesToDisplayNamesMap = {
        "bar graphs": "bar graphs (choices)",
        "histograms": "histograms (scales)",
        "tables": "tables (choices + choices)",
        "multiple histograms": "histogram sets (scales + choices)",
        "scatterplots": "scatterplots (scales + scales)",
        "contingency-histogram tables": "histogram tables (choices + choices + scales)",
        "multiple scatterplots": "scatterplot sets (scales + scales + choices)",
        "correlation maps": "correlation maps (all scales together + choices)",
        "data integrity graphs": "data integrity graphs",
        "texts": "text listings",
    }

    const graphTypesToSingularDisplayNamesMap = {
        "bar graphs": "bar graph (choice)",
        "histograms": "histogram (scale)",
        "tables": "table (choice + choice)",
        "multiple histograms": "histogram set (scale + choice)",
        "scatterplots": "scatterplot (scale + scale)",
        "contingency-histogram tables": "histogram table (choice + choice + scale)",
        "multiple scatterplots": "scatterplot set (scale + scale + choice)",
        "correlation maps": "correlation map (all scales together)",
        "data integrity graphs": "data integrity graph",
        "texts": "text listing",
    }
    
    const columnNames = ["One question at a time", "Two-question combinations", "Three or more questions together"];

    const graphTypesInTableColumns = [
        ["bar graphs", "histograms", "texts"],
        ["tables", "multiple histograms", "scatterplots"],
        ["contingency-histogram tables", "multiple scatterplots", "correlation maps", "data integrity graphs"]
    ]

    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }

    function buildQuestionCheckbox(aName, id, count): any {
        var nameToDisplay;
        if (count == 1) {
            nameToDisplay = " " + count + " " + graphTypesToSingularDisplayNamesMap[id];
        } else {
            nameToDisplay = " " + count + " " + aName;
        }

        return m("div", {style: "margin-bottom: 1em"}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, 
                m("span", [
                m("span", nameToDisplay),
                m("br"),
                m("img", {
                    src: 'help/catalysis/graphThumbnail_' + allGraphTypesThumbnailNames[id] + '.png', 
                    class: "narrafirma-graph-thumbnail"
                }),
            ])),
        ]);
    }
    
    function selectAll() {
        storageFunction(allGraphTypes);
    }
    
    function clearAll() {
        storageFunction({});
    }

    var allGraphTypesAsArray = Object.keys(allGraphTypes);

    var questions = project.allQuestionsThatCouldBeGraphedForCatalysisReport(catalysisReportIdentifier, true);
    var graphTypesToCreate = project.tripleStore.queryLatestC(catalysisReportIdentifier, "graphTypesToCreate");
    var graphMultiChoiceQuestionsAgainstThemselves = project.tripleStore.queryLatestC(catalysisReportIdentifier, "graphMultiChoiceQuestionsAgainstThemselves");
    var totalGraphCount = 0;

    let columnTDs = [];
    for (let i = 0; i < columnNames.length; i++) {
        let column = [];
        column.push(m("b", columnNames[i]));
        column.push(m("br"));
        column.push(m("br"));
        graphTypesInTableColumns[i].forEach(function(graphType) {
            let count = graphCountForGraphType(graphType, questions, graphMultiChoiceQuestionsAgainstThemselves);
            let checkbox = buildQuestionCheckbox(graphTypesToDisplayNamesMap[graphType], graphType, count);
            column.push(checkbox);
            if (graphTypesToCreate && graphTypesToCreate[graphType]) totalGraphCount += count;
        })
        columnTDs.push(m("td", {"class": "narrafirma-graph-types-chooser-table-td"}, column));
    }

    // TODO: Translate

    return m("div.questionExternal", [
        prompt, m("div", [m("table", {"class": "narrafirma-graph-types-chooser-table"}, m("tr", columnTDs))]),
        m("span[style=margin-left: 0.5em]", "Select graph types:"),
        m("button", { onclick: selectAll }, "Select all"),
        m("button", { onclick: clearAll }, "Clear all"),
        m("br"),
        m("p" + tipStyleForGraphCount(totalGraphCount), tipForGraphCount(totalGraphCount))
    ]);
}

function tipForGraphCount(totalGraphCount) {
    var tip;
    if (totalGraphCount === 1) {
        tip = totalGraphCount + " graph selected"
    } else if (totalGraphCount < 5000) {
        tip = totalGraphCount + " graphs selected"
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
    // unless they want axa for multi-choice (checkboxes) questions
    var usedQuestions;
    // two choice questions
    if (graphType === "tables") {
        usedQuestions = [];
        nominalQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            nominalQuestions.forEach((question2) => {
                var okayToGraphQuestionAgainstItself = graphMultiChoiceQuestionsAgainstThemselves && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
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
                var okayToGraphQuestionAgainstItself = graphMultiChoiceQuestionsAgainstThemselves && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
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

    if (graphType === "correlation maps") {
        const scaleQuestions = [];
        questions.forEach( (question) => {
            if (question.displayType === "slider") scaleQuestions.push(question);
        })
        if (scaleQuestions.length >= 3) {
            return 1 + nominalQuestions.length;
        } else {
            return 0;
        }
    }

    console.log("ERROR: Unexpected graph type", graphType);
    alert("ERROR: Unexpected graph type: " + graphType);
    return 0;
}

export = add_catalysisReportGraphTypesChooser;
