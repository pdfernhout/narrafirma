import charting = require("./charting");
import ContentPane = require("dijit/layout/ContentPane");
import GridWithItemPanel = require("../panelBuilder/standardWidgets/GridWithItemPanel");
import kendallsTau = require("../statistics/kendallsTau");
import simpleStatistics = require("../statistics/simple_statistics");
import Stateful = require("dojo/Stateful");
import storyCardDisplay = require("../storyCardDisplay");
import surveyCollection = require("../surveyCollection");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");

"use strict";

// TODO: retrieve from UI
var minStoriesForTest = 20;

// TODO: Duplicate style code of add_graphBrowser
// var chartEnclosureStyle = "width: 850px; height: 650px; margin: 5px auto 0px auto;";
var chartEnclosureStyle = "min-height: 200px;";

// Types of questions that have data associated with them for filters and graphs
var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

// TODO: Duplicate code for this function copied from charting
function nameForQuestion(question) {
    if (question.displayName) return question.displayName;
    if (question.displayPrompt) return question.displayPrompt;
    return question.id;
}

function buildPatternList(graphBrowserInstance) {
    var result = [];
    var nominalQuestions = [];
    var ratioQuestions = [];
    
    // TODO: create all supported graphable permutations of questions
    graphBrowserInstance.questions.forEach(function (question) {
        if (question.displayType === "slider") {
            ratioQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            nominalQuestions.push(question);
        }
    });
    
    var questionCount = 0;
    function nextID() {
        return ("00000" + questionCount++).slice(-5);
    }
 
    nominalQuestions.forEach(function (question1) {
        result.push({id: nextID(), observation: "", graphType: "bar", patternName: nameForQuestion(question1) + " (C)", questions: [question1]});
    });
    
    // Prevent mirror duplicates and self-matching questions
    var usedQuestions;
    
    usedQuestions = [];
    nominalQuestions.forEach(function (question1) {
        usedQuestions.push(question1);
        nominalQuestions.forEach(function (question2) {
            if (usedQuestions.indexOf(question2) !== -1) return;
            result.push({id: nextID(), observation: "", graphType: "table", patternName: nameForQuestion(question1) + " (C) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
        });
    });
    
    ratioQuestions.forEach(function (question1) {
        result.push({id: nextID(), observation: "", graphType: "histogram", patternName: nameForQuestion(question1) + " (S)", questions: [question1]});
    });
    
    ratioQuestions.forEach(function (question1) {
        nominalQuestions.forEach(function (question2) {
            result.push({id: nextID(), observation: "", graphType: "multiple histogram", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
        });
    });
    
    usedQuestions = [];
    ratioQuestions.forEach(function (question1) {
        usedQuestions.push(question1);
        ratioQuestions.forEach(function (question2) {
            if (usedQuestions.indexOf(question2) !== -1) return;
            result.push({id: nextID(), observation: "", graphType: "scatter", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (S)", questions: [question1, question2]});
        });
    });
    
    /* TODO: For later
    ratioQuestions.forEach(function (question1) {
        ratioQuestions.forEach(function (question2) {
            nominalQuestions.forEach(function (question3) {
                result.push({id: nextID(), observation: "", graphType: "multiple scatter", patternName: nameForQuestion(question1) + " (S)" + " vs. " + nameForQuestion(question2) + " (S) vs. " + nameForQuestion(question3) + " (C)", questions: [question1, question2, question3]});
            });
        });
    });
    */

    result.forEach(function (pattern) {
        calculateStatisticsForPattern(graphBrowserInstance, pattern, minStoriesForTest);        
    });
    
    console.log("buildPatternsList", result);
    return result;
}

function collectDataForField(stories, fieldName) {
    var result = [];
    for (var i = 0; i < stories.length; i++) {
        var value = stories[i][fieldName];
        result.push(value);
    }
    return result;
}

function countsForFieldChoices(stories, field1, field2) {
    console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var counts = {};
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i][field1];
        var value2 = stories[i][field2];
        var value = JSON.stringify([value1, value2]);
        // console.log("value", value, value1, value2);
        var count = counts[value];
        if (!count) count = 0;
        count++;
        counts[value] = count;
    }
    return counts;
}

function collectValues(dict) {
    var values = [];
    for (var key in dict) {
        values.push(dict[key]);
    }
    return values;
}

function calculateStatisticsForPattern(graphBrowserInstance, pattern, minStoriesForTest) {
    var graphType = pattern.graphType;
    var significance;
    var statResult;
    var stories = graphBrowserInstance.allStories;
    
    if (graphType === "bar") {
    	// not calculating statistics for bar graph
    } else if (graphType === "table") {
        // both not continuous -- look for a 'correspondence' between counts using Chi-squared test
        // TODO: Fix this
    	// TODO: test for missing patterns[1]
        var counts = countsForFieldChoices(stories, pattern.questions[0].id, pattern.questions[1].id);
        console.log("counts", counts);
        var values = collectValues(counts);
        console.log("values", values);
        if (values.length < minStoriesForTest) {
        	significance = "";
        } else {
            // return {chi_squared: chi_squared, testSignificance: testSignificance}
        	statResult = simpleStatistics.chi_squared_goodness_of_fit(values, simpleStatistics.poisson_distribution, 0.05);
            significance = statResult.testSignificance;
    	}
    } else if (graphType === "histogram") {
        // TODO: ? look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
        // TODO: Fix this - could report on normality
        significance = "";
    } else if (graphType === "multiple histogram") {
        // TODO: ? one of each continuos and not -- for each option, look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
        // TODO: Fix this - t-test - differences between means of histograms
        significance = -1.0;
    } else if (graphType === "scatter") {
        // TODO: both continuous -- look for correlation with Pearson's R (if normal distribution) or Spearman's R / Kendall's Tau (if not normal distribution)"
        var data1 = collectDataForField(stories, pattern.questions[0].id);
        var data2 = collectDataForField(stories, pattern.questions[1].id);
        statResult = kendallsTau(data1, data2);
        significance = statResult.prob.toFixed(4);
    } else if (graphType ===  "multiple scatter") {
        console.log("ERROR: Not suported graphType: " + graphType);
    } else {
        console.log("ERROR: Unexpected graphType: " + graphType);
    }
    
    if (significance !== undefined) pattern.significance = significance;
}

function chooseGraph(graphBrowserInstance, pattern) {
    console.log("chooseGraph", pattern);
    
    // Remove old graph(s)
    while (graphBrowserInstance.chartPanes.length) {
        var chartPane = graphBrowserInstance.chartPanes.pop();
        chartPane.destroyRecursive(false);
    }
    
    if (pattern === null) {
        // TODO: Translate
        var suggestionPane = new ContentPane({content: "<b>Please select a pattern to see a graph...<b>"});
        graphBrowserInstance.chartPanes.push(suggestionPane);
        graphBrowserInstance.graphResultsPane.addChild(suggestionPane);
        return;
    }
    
    var name = pattern.patternName;
    var type = pattern.graphType;
    console.log("pattern", name, type);
    var q1 = pattern.questions[0];
    var q2 = pattern.questions[1];
    var currentGraph = null;
    switch (type) {
        case "bar":
            currentGraph = charting.d3BarChart(graphBrowserInstance, q1, updateStoriesPane);
            break;
        case "table":
            currentGraph = charting.d3ContingencyTable(graphBrowserInstance, q1, q2, updateStoriesPane);
            break;
        case "histogram":
            currentGraph = charting.d3HistogramChart(graphBrowserInstance, q1, null, null, updateStoriesPane);
            break;
        case "multiple histogram":
            // Choice question needs to come before scale question in args
            currentGraph = charting.multipleHistograms(graphBrowserInstance, q2, q1, updateStoriesPane);
            break;
        case "scatter":
            currentGraph = charting.d3ScatterPlot(graphBrowserInstance, q1, q2, updateStoriesPane);
            break;        
       default:
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            break;
    }
    graphBrowserInstance.currentGraph = currentGraph;
    graphBrowserInstance.currentSelectionExtentPercentages = null;
    graphBrowserInstance.currentSelectionSubgraph = null;
}

function updateStoriesPane(graphBrowserInstance, stories) {
    graphBrowserInstance.selectedStories = stories;
    graphBrowserInstance.selectedStoriesStore.setData(stories);
    graphBrowserInstance.storyList.dataStoreChanged(graphBrowserInstance.selectedStoriesStore);
}

// TODO: Next two functions from add_storyBrowser and so are duplicate code

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, contentPane, model) {
    var storyContent = storyCardDisplay.generateStoryCardContent(model, model.questionnaire, "includeElicitingQuestion");
    
    var storyPane = new ContentPane({
        content: storyContent           
    });
    storyPane.placeAt(contentPane);
}

function makeItemPanelSpecificationForQuestions(questions) {
    // TODO: add more participant and survey info, like timestamps and participant ID
    
    var storyItemPanelSpecification = {
         id: "storyBrowserQuestions",
         panelFields: questions,
         buildPanel: buildStoryDisplayPanel
    };
    
    return storyItemPanelSpecification;
}

function findCatalysisReport(project, shortName) {
    var catalysisReports = project.projectModel.get("project_catalysisReports");
    for (var i = 0; i < catalysisReports.length; i++) {
        if (catalysisReports[i].catalysisReport_shortName === shortName) {
            return catalysisReports[i];
        }
    }
    return null;
}

function currentCatalysisReportChanged(graphBrowserInstance, fieldName, oldValue, currentCatalysisReportIdentifier) {
    console.log("currentCatalysisReportChanged", graphBrowserInstance, currentCatalysisReportIdentifier);
    
    var catalysisReport = findCatalysisReport(graphBrowserInstance.project, currentCatalysisReportIdentifier);
    if (!catalysisReport) {
        // TODO: should clear everything
        return;
    }
    
    // TODO: Handle multiple story collections
    // TODO: Better handling when can't find something
    
    var storyCollectionPointer = catalysisReport.catalysisReport_storyCollections[catalysisReport.catalysisReport_storyCollections.length - 1];
    if (!storyCollectionPointer) return;

    var storyCollectionIdentifier = storyCollectionPointer.storyCollection;
    
    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    if (!questionnaire) return;
    
    var questions = surveyCollection.collectQuestionsForQuestionnaire(questionnaire);
    
    console.log("questions", questions);
    
    graphBrowserInstance.questions = questions;
    
    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
    graphBrowserInstance.allStories = allStories;
    
    console.log("allStories", allStories);

    var patterns = buildPatternList(graphBrowserInstance);
    graphBrowserInstance.patterns = patterns;
    graphBrowserInstance.patternsListStore.setData(patterns);
    graphBrowserInstance.patternsGrid.dataStoreChanged(graphBrowserInstance.patternsListStore);
    
    // Update item panel in story list so it has the correct header
    var itemPanelSpecification = makeItemPanelSpecificationForQuestions(questions);
    graphBrowserInstance.storyList.changeItemPanelSpecification(itemPanelSpecification);

    chooseGraph(graphBrowserInstance, null);
}

function patternSelected(graphBrowserInstance, grid, selectedPattern) {
    console.log("Select in grid", grid, selectedPattern);
    var observation;
    if (graphBrowserInstance.currentPattern) {
        // save observation
        observation = graphBrowserInstance.observationModel.get("observation");
        var oldObservation = graphBrowserInstance.currentPattern.observation || "";
        if (oldObservation !== observation) {
            graphBrowserInstance.currentPattern.observation = observation;
            graphBrowserInstance.patternsListStore.put(graphBrowserInstance.currentPattern);
        }
    }
    chooseGraph(graphBrowserInstance, selectedPattern);
    observation = "";
    if (selectedPattern) observation = selectedPattern.observation;
    graphBrowserInstance.observationModel.set("observation", observation);
    graphBrowserInstance.currentPattern = selectedPattern;
    
    graphBrowserInstance.selectedStories = [];
    graphBrowserInstance.selectedStoriesStore.setData(graphBrowserInstance.selectedStories);
    graphBrowserInstance.storyList.dataStoreChanged(graphBrowserInstance.selectedStoriesStore);
}

// Do not store the option texts directly in selection as they might have braces
//function sha256ForOption(optionText) {
//    return SHA256(optionText, digests.outputTypes.Hex);
//}

function decodeBraces(optionText) {
    return optionText.replace("&#123;", "{").replace("&#125;", "}"); 
}

function insertGraphSelection(graphBrowserInstance) {
    if (!graphBrowserInstance.currentGraph) {
        // TODO: Translated
        alert("Please select a pattern first");
        return;
    }
    
    if (!graphBrowserInstance.currentSelectionExtentPercentages) {
        alert("Please select something in a graph first");
        return;
    }
    
    console.log("graphBrowserInstance.currentGraph", graphBrowserInstance.currentGraph);
    
    if (scanForSelectionJSON(graphBrowserInstance)) {
        // TODO: Translate
        alert("The insertion would change a previously saved selection within a {...} section;\nplease pick a different insertion point.");
        return;
    }
    
    // Find observation textarea and other needed data
    var observationTextarea = graphBrowserInstance.widgets.observation;
    var textModel = graphBrowserInstance.observationModel;
    var selection = graphBrowserInstance.currentSelectionExtentPercentages;
    var textToInsert = JSON.stringify(selection);
    
    // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
    var textarea = observationTextarea.textbox;
    var selectionStart = textarea.selectionStart;
    var selectionEnd = textarea.selectionEnd;
    var oldText = textModel.get("observation");
    var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
    textModel.set("observation", newText);
    textarea.selectionStart = selectionStart;
    textarea.selectionEnd = selectionStart + textToInsert.length;
    textarea.focus();
}

function scanForSelectionJSON(graphBrowserInstance, doFocus = false) {
    var observationTextarea = graphBrowserInstance.widgets.observation;
    var textModel = graphBrowserInstance.observationModel;
    var textarea = observationTextarea.textbox;
    var text = textModel.get("observation");

    if (doFocus) textarea.focus();

    var selectionStart = textarea.selectionStart;
    var selectionEnd = textarea.selectionEnd;
    
    // Find the text for a selection surrounding the current insertion point
    // This assumes there are not nested objects with nested braces
    var start;
    var end;
    
    // Special case of entire selection -- but could return more complex nested object...
    if (selectionStart !== selectionEnd) {
        if (text.charAt(selectionStart) === "{" && text.charAt(selectionEnd - 1) === "}") {
            return text.substring(selectionStart, selectionEnd);
        }
    }
    
    for (start = selectionStart - 1; start >= 0; start--) {
        if (text.charAt(start) === "}") return null;
        if (text.charAt(start) === "{") break;
    }
    if (start < 0) return null;
    // Now find the end
    for (end = start; end < text.length; end++) {
        if (text.charAt(end) === "}") break;
    }
    if (end >= text.length) return null;
    return text.substring(start, end + 1);
}

function resetGraphSelection(graphBrowserInstance) {
    console.log("resetGraphSelection");
    if (!graphBrowserInstance.currentGraph) {
        // TODO: Translate
        alert("Please select a pattern first");
        return;
    }
    
    // TODO: Need better approach to finding brush extent text and safely parsing it

    // Find observation textarea and other needed data
    // var selectedText = oldText.substring(selectionStart, selectionEnd);
    var selectedText = scanForSelectionJSON(graphBrowserInstance, true);
    if (!selectedText) {
        // TODO: Translate
        alert("The text insertion point was not inside a graph selection description.\nTry clicking inside the {...} items first.");
        return;
    }
    
    var selection = null;
    try {
        selection = JSON.parse(selectedText);
    } catch (e) {
        console.log("JSON parse error", e);
    }
    
    if (!selection) {
        // TODO: Translate
        alert('The selected text was not a complete valid stored selection.\nTry clicking inside the {...} items first.');
        return;
    }
    
    console.log("selection from user", selection);
    
    var graph = graphBrowserInstance.currentGraph;
    if (_.isArray(graph)) {
        var optionText = selection.subgraphChoice;
        if (!optionText) {
            // TODO: Translate
            alert("No subgraphChoice specified in stored selection");
            return;
        }
        optionText = decodeBraces(optionText);
        var graphs = graphBrowserInstance.currentGraph;
        graphs.forEach(function (subgraph) {
            if (subgraph.subgraphChoice === optionText) {
                graph = subgraph;
            }
        });
    }
    
    charting.restoreSelection(graph, selection);
}

function add_trendsReport(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);

    var graphResultsPane = new ContentPane({
        // TODO: Translate
        title: "Graph results",
        style: chartEnclosureStyle,
        region: "bottom"
    });
    
    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    console.log("choiceModelAndField", choiceModelAndField);
    var choiceModel = choiceModelAndField.model;
    var choiceField = choiceModelAndField.field; 
    var catalysisReportIdentifier = choiceModel.get(choiceField);
    
    console.log("catalysisReportIdentifier", catalysisReportIdentifier);
    
    //  TODO: Update these based on selection
    var questions = [];
    var allStories = [];
    
    // TODO: var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
    // TODO: get all stories
    
    var graphBrowserInstance = {
        project: panelBuilder.project,
        graphResultsPane: graphResultsPane,
        chartPanes: [], 
        questions: questions,
        allStories: allStories,
        patterns: null,
        patternsListStore: null,
        patternsGrid: null,
        selectedStories: [],
        selectedStoriesStore: null, 
        storyList: null,
        observationModel: new Stateful({observation: ""}),
        currentPattern: null,
        currentGraph: null,
        // TODO: These are not used yet
        currentSelectionExtentPercentages: null,
        currentSelectionSubgraph: null,
        widgets: undefined
    };
    
    var currentCatalysisReportSubscription = choiceModel.watch(choiceField, currentCatalysisReportChanged.bind(null, graphBrowserInstance));        
    // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
    contentPane.own(currentCatalysisReportSubscription);
    
    var patterns = buildPatternList(graphBrowserInstance);
    graphBrowserInstance.patterns = patterns;
   
    var patternsListStore = GridWithItemPanel["newMemoryTrackableStore"](patterns, "id");
    graphBrowserInstance.patternsListStore = patternsListStore;
    
    var patternsGridConfiguration = {
        navigationButtons: true,
        includeAllFields: true,
        selectCallback: patternSelected.bind(null, graphBrowserInstance)
    };
    
    var patternsPanelSpecification = {
        "id": "patternsPanel",
        panelFields: [
            {id: "id", displayName: "Index"},
            {id: "patternName", displayName: "Pattern name", valueOptions:[]},
            {id: "graphType", displayName: "Graph type", valueOptions:[]},
            {id: "significance", displayName: "Significance value", valueOptions:[]},
            // {id: "reviewed", displayName: "Reviewed", valueOptions:[]},
            {id: "observation", displayName: "Observation", valueOptions:[]}
        ]
    };
    
    // TODO: Splitter does not seem to work as expected; it has no height. This does not help: https://www.sitepen.com/blog/2013/05/02/dojo-faq-bordercontainer-not-visible/
    var splitterPane = new ContentPane(); // BorderContainer({style:'border:1px solid black'});
    contentPane.addChild(splitterPane);
    var gridContainerPane = new ContentPane({region: "center", splitter: true});
    splitterPane.addChild(gridContainerPane);
    splitterPane.addChild(graphResultsPane);
    //splitterPane.startup();
    //splitterPane.resize();
    
    var patternsGrid = new GridWithItemPanel(panelBuilder, gridContainerPane, "patternsList", patternsListStore, patternsPanelSpecification, patternsGridConfiguration, model);
    patternsGrid.grid.set("selectionMode", "single");
    graphBrowserInstance.patternsGrid = patternsGrid;
    
    var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(questions);

    // Store will modify underlying array
    var selectedStoriesStore = GridWithItemPanel["newMemoryTrackableStore"](graphBrowserInstance.selectedStories, "_storyID");
    graphBrowserInstance.selectedStoriesStore = selectedStoriesStore;
    
    // Only allow view button for stories
    var configuration = {viewButton: true, includeAllFields: ["__survey_storyName", "__survey_storyText"], navigationButtons: true};
    var storyList = new GridWithItemPanel(panelBuilder, contentPane, "storyGrid", selectedStoriesStore, storyItemPanelSpecification, configuration, model);
    storyList.grid.set("selectionMode", "single");
    graphBrowserInstance.storyList = storyList;
    
    var observationPanelSpecification = {
        "id": "observationPanel",
        panelFields: [        
            {id: "insertGraphSelection", displayPrompt: "Save current graph selection into observation", displayType: "button", displayPreventBreak: true, displayConfiguration: insertGraphSelection.bind(null, graphBrowserInstance)},
            {id: "resetGraphSelection", displayPrompt: "Restore graph selection using saved selection chosen in observation", displayType: "button", displayConfiguration: resetGraphSelection.bind(null, graphBrowserInstance)},
            {id: "observation", displayName: "Observation", displayPrompt: "If this pattern is noteworthy, enter an <strong>observation</strong> about the pattern here.", displayType: "textarea"},
            {
                "id": "project_interpretationsList",
                "valueType": "array",
                "required": true,
                "displayType": "grid",
                "displayConfiguration": "panel_addInterpretation",
                "displayName": "Interpretation",
                "displayPrompt": "Enter at least two <strong>competing interpretations</strong> for the observation here."
            }
        ]
    };
    
    // var observationPane = new ContentPane();
    // contentPane.addChild(observationPane);
    var widgets = panelBuilder.buildPanel(observationPanelSpecification, contentPane, graphBrowserInstance.observationModel);
    graphBrowserInstance.widgets = widgets;
    
    // TODO: selections should be stored in original domain units, not scaled display units
    // TODO: Consolidate duplicate code from these two functions
    
    currentCatalysisReportChanged(graphBrowserInstance, "currentCatalysisReport", null, catalysisReportIdentifier);
    
    // Put up a "please pick pattern" message
    chooseGraph(graphBrowserInstance, null);
    
    // TODO: Not sure what to return or if it matters
    return questionContentPane;
}

export = add_trendsReport;
