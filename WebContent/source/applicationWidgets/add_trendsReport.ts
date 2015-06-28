import charting = require("./charting");
import kendallsTau = require("../statistics/kendallsTau");
import simpleStatistics = require("../statistics/simple_statistics");
import storyCardDisplay = require("../storyCardDisplay");
import surveyCollection = require("../surveyCollection");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import Project = require("../Project");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");

"use strict";

// TODO: retrieve from UI
var minStoriesForTest = 20;

// Types of questions that have data associated with them for filters and graphs
var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

// TODO: Duplicate code for this function copied from charting
function nameForQuestion(question) {
    if (question.displayName) return question.displayName;
    if (question.displayPrompt) return question.displayPrompt;
    return question.id;
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

// TODO: Next two functions from add_storyBrowser and so are duplicate code

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, model) {
    var storyContent = storyCardDisplay.generateStoryCardContent(model, model.questionnaire, "includeElicitingQuestion");
    
     return m("div[class=storyCard]", m.trust(storyContent));
}

function makeItemPanelSpecificationForQuestions(questions) {
    // TODO: add more participant and survey info, like timestamps and participant ID
    
    var storyItemPanelSpecification = {
         id: "patternBrowserQuestions",
         panelFields: questions,
         buildPanel: buildStoryDisplayPanel
    };
    
    return storyItemPanelSpecification;
}

// Do not store the option texts directly in selection as they might have braces
//function sha256ForOption(optionText) {
//    return SHA256(optionText, digests.outputTypes.Hex);
//}

function decodeBraces(optionText) {
    return optionText.replace("&#123;", "{").replace("&#125;", "}"); 
}

// TODO: Duplicate of what is in add_graphBrowser
// title: "Graph results",
function createGraphResultsPane(): HTMLElement {
    var pane = document.createElement("div");
    pane.className = "narrafirma-graph-results-pane chartEnclosure";
    return pane;
}

// TODO: Similar to what is in add_graphBrowser
function getCurrentCatalysisReportIdentifier(args) {
    var panelBuilder = args.panelBuilder;
    var model = args.model;
    var fieldSpecification = args.fieldSpecification;
    
    // Get questionnaire for selected story collection
    // TODO: What if the value is an array of stories to display directly?
    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    console.log("choiceModelAndField", choiceModelAndField);
    var choiceModel = choiceModelAndField.model;
    var choiceField = choiceModelAndField.field; 
    var catalysisReportIdentifier = choiceModel[choiceField];
    
    console.log("catalysisReportIdentifier", catalysisReportIdentifier);
    
    return catalysisReportIdentifier;
}

class PatternBrowser {
    project: Project = null;
    catalysisReportIdentifier: string = null;
    
    modelForPatternsGrid = {patterns: []};
    patternsGrid: GridWithItemPanel;
    
    graphHolder: GraphHolder;
    
    questions = [];
    // allStories = [];
    
    modelForStoryGrid = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: GridDisplayConfiguration = null;
    storyGrid: GridWithItemPanel = null;
     
    modelForObservation = {observation: ""};
    currentPattern = null;
    
    observationPanelSpecification = null;
    
    // TODO: Track currentCatalysisReportChanged
    // TODO: Update questions and allStories based on selection
    
    constructor(args) {
        this.project = args.panelBuilder.project;
        // this.catalysisReportIdentifier = getCurrentCatalysisReportIdentifier(args);
        
        // Pattern grid initialization
        
        this.modelForPatternsGrid.patterns = this.buildPatternList();
          
        var patternsPanelSpecification = {
            "id": "patternsPanel",
            panelFields: [
                {id: "id", displayName: "Index"},
                {id: "patternName", displayName: "Pattern name", valueOptions: []},
                {id: "graphType", displayName: "Graph type", valueOptions: []},
                {id: "significance", displayName: "Significance value", valueOptions: []},
                // {id: "reviewed", displayName: "Reviewed", valueOptions: []},
                {id: "observation", displayName: "Observation", valueOptions: []}
            ]
        };
        
        var patternsGridConfiguration = {
            idProperty: "id",
            includeAllFields: true,
            navigationButtons: true,
            selectCallback: this.patternSelected.bind(this)
        };
        
        var patternsGridFieldSpecification = {
            id: "patterns",
            displayConfiguration: {
                itemPanelSpecification: patternsPanelSpecification,
                gridConfiguration: patternsGridConfiguration
            }
        };
 
        this.patternsGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForPatternsGrid, fieldSpecification: patternsGridFieldSpecification});
    
        // Graph display initializaiton
        
       this.graphHolder = {
            graphResultsPane: createGraphResultsPane(),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null
        };
        
        // Story grid initialization
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);

        var storyGridConfiguration = {
            idProperty: "_storyID",
            includeAllFields: ["__survey_storyName", "__survey_storyText"],
            viewButton: true,
            navigationButtons: true
        };
        
        this.storyGridFieldSpecification = {
            id: "storiesSelectedInGraph",
            itemPanelID: undefined,
            itemPanelSpecification: storyItemPanelSpecification,
            displayConfiguration: {
                itemPanelSpecification: storyItemPanelSpecification,
                gridConfiguration: storyGridConfiguration
            },
            gridConfiguration: storyGridConfiguration
        };

        this.storyGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForStoryGrid, fieldSpecification: this.storyGridFieldSpecification});

        // Observation panel initialization
        
        this.observationPanelSpecification = {
            "id": "observationPanel",
            panelFields: [        
                {
                    id: "observationPanel_insertGraphSelection",
                    displayPrompt: "Save current graph selection into observation",
                    displayType: "button",
                    displayPreventBreak: true,
                    displayConfiguration: this.insertGraphSelection.bind(this)
                },
                {
                    id: "observationPanel_resetGraphSelection",
                    displayPrompt: "Restore graph selection using saved selection chosen in observation",
                    displayType: "button",
                    displayConfiguration: this.resetGraphSelection.bind(this)
                },
                {
                    id: "observationPanel_observation",
                    valuePath: "observation",
                    displayName: "Observation",
                    displayPrompt: "If this pattern is noteworthy, enter an <strong>observation</strong> about the pattern here.",
                    displayType: "textarea"
                },
                {
                    id: "observationPanel_interpretationsList",
                    valueType: "array",
                    required: true,
                    displayType: "grid",
                    displayConfiguration: "panel_addInterpretation",
                    displayName: "Interpretation",
                    displayPrompt: "Enter at least two <strong>competing interpretations</strong> for the observation here."
                }
            ]
        };
        
        // TODO: selections in observation should be stored in original domain units, not scaled display units
 
        // Put up a "please pick pattern" message
        this.chooseGraph(null);
    }
    
    static controller(args) {
        console.log("Making PatternBrowser: ", args);
        return new PatternBrowser(args);
    }
    
    static view(controller, args) {
        console.log("PatternBrowser view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        console.log("%%%%%%%%%%%%%%%%%%% PatternBrowser view called");
        var panelBuilder: PanelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        var catalysisReportIdentifier = getCurrentCatalysisReportIdentifier(args);
        if (catalysisReportIdentifier !== this.catalysisReportIdentifier) {
            this.catalysisReportIdentifier = catalysisReportIdentifier;
            console.log("storyCollectionIdentifier changed", this.catalysisReportIdentifier);
            this.currentCatalysisReportChanged(this.catalysisReportIdentifier);
        }
        
        var parts;
        
        if (!this.catalysisReportIdentifier) {
            parts = [m("div", "Please select a catalysis report to work with")];
        } else {
            parts = [
                this.patternsGrid.calculateView(),
                this.currentPattern ?
                    m("div", {config: this.insertGraphResultsPaneConfig.bind(this)}) :
                   // TODO: Translate
                    m("div", "Please select a pattern to view as a graph"),
                this.storyGrid.calculateView(),
                panelBuilder.buildPanel(this.observationPanelSpecification, this.modelForObservation)
            ];
        }
        
        // TODO: Need to set class
        return m("div", parts);
    }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any, vdom: _mithril.MithrilVirtualElement) {
        if (!isInitialized) {
            console.log("appending graph element");
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    currentCatalysisReportChanged(currentCatalysisReportIdentifier) {
        console.log("currentCatalysisReportChanged", currentCatalysisReportIdentifier);
        
        var catalysisReport = this.findCatalysisReport(this.project, currentCatalysisReportIdentifier);
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
        if (!questionnaire) {
            // TODO: Should clear more stuff?
            return;
        }
        
        this.graphHolder.allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier);
        console.log("allStories", this.graphHolder.allStories);
        
        this.questions = surveyCollection.collectQuestionsForQuestionnaire(questionnaire);
        console.log("questions", this.questions);
        
        this.modelForPatternsGrid.patterns = this.buildPatternList();
        console.log("patterns", this.modelForPatternsGrid.patterns);
        this.patternsGrid.updateData();

        // Update item panel in story list so it has the correct header
        this.storyGridFieldSpecification.itemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);
        this.storyGrid.updateDisplayConfigurationAndData(this.storyGridFieldSpecification);
    
        this.chooseGraph(null);     
    }
    
    
    findCatalysisReport(project, shortName) {
        var catalysisReports = project.projectModel.project_catalysisReports;
        for (var i = 0; i < catalysisReports.length; i++) {
            if (catalysisReports[i].catalysisReport_shortName === shortName) {
                return catalysisReports[i];
            }
        }
        return null;
    }

    buildPatternList() {
        var result = [];
        var nominalQuestions = [];
        var ratioQuestions = [];
        
        // TODO: create all supported graphable permutations of questions
        this.questions.forEach(function (question) {
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
    
        result.forEach((pattern) => {
            this.calculateStatisticsForPattern(pattern, minStoriesForTest);        
        });
        
        console.log("buildPatternsList", result);
        return result;
    }
    
    calculateStatisticsForPattern(pattern, minStoriesForTest) {
        var graphType = pattern.graphType;
        var significance;
        var statResult;
        var stories = this.graphHolder.allStories;
        
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
    
    chooseGraph(pattern) {
        console.log("chooseGraph", pattern);
        
        // Remove old graph(s)
        while (this.graphHolder.chartPanes.length) {
            var chartPane = this.graphHolder.chartPanes.pop();
            this.graphHolder.graphResultsPane.removeChild(chartPane);
            // TODO: Do these need to be destroyed or freed somehow?
        }
        
        // Need to remove the float end node, if any        
        while (this.graphHolder.graphResultsPane.firstChild) {
            this.graphHolder.graphResultsPane.removeChild(this.graphHolder.graphResultsPane.firstChild);
        }
        
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        
        if (pattern === null) {
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
                currentGraph = charting.d3BarChart(this.graphHolder, q1, this.updateStoriesPane.bind(this));
                break;
            case "table":
                currentGraph = charting.d3ContingencyTable(this.graphHolder, q1, q2, this.updateStoriesPane.bind(this));
                break;
            case "histogram":
                currentGraph = charting.d3HistogramChart(this.graphHolder, q1, null, null, this.updateStoriesPane.bind(this));
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                currentGraph = charting.multipleHistograms(this.graphHolder, q2, q1, this.updateStoriesPane.bind(this));
                break;
            case "scatter":
                currentGraph = charting.d3ScatterPlot(this.graphHolder, q1, q2, this.updateStoriesPane.bind(this));
                break;        
           default:
                console.log("ERROR: Unexpected graph type");
                alert("ERROR: Unexpected graph type");
                break;
        }
        this.graphHolder.currentGraph = currentGraph;
        this.graphHolder.currentSelectionExtentPercentages = null;
        // TODO: Is this obsolete? this.graphHolder.currentSelectionSubgraph = null;
        
        // Since the change is coming from a timeout for the selection, we need to queue a Mithril redraw to refresh the display
        console.log("about to call m.redraw");
        m.redraw();
    }
    
    updateStoriesPane(stories) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
        
        // Since the change is coming from d3, we need to queue a Mithril redraw to refresh the display
        console.log("about to call m.redraw");
        m.redraw();
    }
    
    patternSelected(selectedPattern) {
        console.log("Select in pattern grid", selectedPattern);
        var observation;
        if (this.currentPattern) {
            // save observation
            observation = this.modelForObservation.observation;
            var oldObservation = this.currentPattern.observation || "";
            if (oldObservation !== observation) {
                this.currentPattern.observation = observation;
            }
        }
        this.chooseGraph(selectedPattern);
        observation = "";
        if (selectedPattern) observation = selectedPattern.observation;
        this.modelForObservation.observation = observation;
        this.currentPattern = selectedPattern;
        
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        this.storyGrid.updateData();
    }
    
    insertGraphSelection() {
        console.log("insertGraphSelection");
        if (!this.graphHolder.currentGraph) {
            // TODO: Translated
            alert("Please select a pattern first");
            return;
        }
        
        if (!this.graphHolder.currentSelectionExtentPercentages) {
            alert("Please select something in a graph first");
            return;
        }
        
        console.log("PatternsBrowser currentGraph", this.graphHolder.currentGraph);
        
        if (this.scanForSelectionJSON()) {
            // TODO: Translate
            alert("The insertion would change a previously saved selection within a {...} section;\nplease pick a different insertion point.");
            return;
        }
        
        // Find observation textarea and other needed data
        // TODO: Fix this for Mithril conversion
        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_observation");
        var textModel = this.modelForObservation;
        var selection = this.graphHolder.currentSelectionExtentPercentages;
        var textToInsert = JSON.stringify(selection);
        
        // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
        var selectionStart = textarea.selectionStart;
        var selectionEnd = textarea.selectionEnd;
        var oldText = textModel.observation;
        var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
        textModel.observation = newText;
        // Set the new explicitly here rather than waiting for a redraw so that we can then select it
        textarea.value = newText;
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart + textToInsert.length;
        textarea.focus();
    }
    
    scanForSelectionJSON(doFocus = false) {
        console.log("scanForSelectionJSON");
        // TODO: Fix this for Mithril conversion
        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_observation");
        var textModel = this.modelForObservation;
        var text = textModel.observation;
    
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
    
    resetGraphSelection() {
        console.log("resetGraphSelection");
        if (!this.graphHolder.currentGraph) {
            // TODO: Translate
            alert("Please select a pattern first");
            return;
        }
        
        // TODO: Need better approach to finding brush extent text and safely parsing it
    
        // Find observation textarea and other needed data
        // var selectedText = oldText.substring(selectionStart, selectionEnd);
        var selectedText = this.scanForSelectionJSON(true);
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
        
        var graph = this.graphHolder.currentGraph;
        if (_.isArray(graph)) {
            var optionText = selection.subgraphChoice;
            if (!optionText) {
                // TODO: Translate
                alert("No subgraphChoice specified in stored selection");
                return;
            }
            optionText = decodeBraces(optionText);
            var graphs = this.graphHolder.currentGraph;
            graphs.forEach(function (subgraph) {
                if (subgraph.subgraphChoice === optionText) {
                    graph = subgraph;
                }
            });
        }
        
        charting.restoreSelection(graph, selection);
    }
}

function add_trendsReport(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var patternBrowser = m.component(<any>PatternBrowser, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
 
    return m("div", [
        prompt,
        patternBrowser
     ]);
}

export = add_trendsReport;
