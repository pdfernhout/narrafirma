import charting = require("./charting");
import kendallsTau = require("../statistics/kendallsTau");
import chiSquare = require("../statistics/chiSquare");
import mannWhitneyU = require("../statistics/mannWhitneyU");
import storyCardDisplay = require("../storyCardDisplay");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import Project = require("../Project");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import Globals = require("../Globals");

"use strict";

// Library for statistics, imported by narrafirma.html
declare var jStat;

var defaultMinimumStoryCountRequiredForTest = 20;

// Question types that have data associated with them for filters and graphs
var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons", "text"];

var patternsPanelSpecification = {
    id: "patternsPanel",
    modelClass: "Pattern",
    panelFields: [
        {id: "id", displayName: "Index"},
        {id: "patternName", displayName: "Pattern name", valueOptions: []},
        {id: "graphType", displayName: "Graph type", valueOptions: []},
        {id: "significance", displayName: "Significance value", valueOptions: []},
        // {id: "reviewed", displayName: "Reviewed", valueOptions: []},
        {id: "observation", displayName: "Observation", valueOptions: []}
    ]
};

// TODO: Duplicate code for this function copied from charting
function nameForQuestion(question) {
    if (question.displayName) return question.displayName;
    if (question.displayPrompt) return question.displayPrompt;
    return question.id;
}

/*
function collectDataForField(stories: surveyCollection.Story[], fieldName) {
    var result = [];
    for (var i = 0; i < stories.length; i++) {
        var value = stories[i].fieldValue(fieldName);
        if (value === null || value === undefined) continue;
        result.push(value);
    }
    return result;
}
*/

function isValidNumber(value) {
    // console.log("isValidNumber", JSON.stringify(value));
    return value !== "" && !isNaN(value);
}

function collectXYDataForFields(stories: surveyCollection.Story[], xFieldName, yFieldName) {
    var xResult = [];
    var yResult = [];
    for (var i = 0; i < stories.length; i++) {
        var xValue = stories[i].fieldValue(xFieldName);
        if (!isValidNumber(xValue)) continue;
        var yValue = stories[i].fieldValue(yFieldName);
        if (!isValidNumber(yValue)) continue;
        xResult.push(xValue);
        yResult.push(yValue);
    }
    return {x: xResult, y: yResult};
}


function addValue(arrayHolder, fieldName, value) {
    var values = arrayHolder[fieldName];
    if (!values) values = [];
    values.push(value);
    arrayHolder[fieldName] = values;
}

function valuesForFieldChoices(stories: surveyCollection.Story[], scaleQuestionID, choiceQuestionID) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var values = {};
    for (var i = 0; i < stories.length; i++) {
        var scaleValue = stories[i].fieldValue(scaleQuestionID);
        if (scaleValue === null || scaleValue === undefined || scaleValue === "") continue; // value1 = "{N/A}";

        var choiceValue = stories[i].fieldValue(choiceQuestionID);
        if (choiceValue === null || choiceValue === undefined || scaleValue === "") continue; // value1 = "{N/A}";

        addValue(values, choiceValue, scaleValue);
    }
    return values;
}

/*
function countsForFieldChoices(stories: surveyCollection.Story[], field1, field2) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var counts = {};
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        var value2 = stories[i].fieldValue(field2);
        var value = JSON.stringify([value1, value2]);
        // console.log("value", value, value1, value2);
        var count = counts[value];
        if (!count) count = 0;
        count++;
        counts[value] = count;
    }
    return counts;
}
*/

/*
function countsForFieldChoice(stories: surveyCollection.Story[], field1) {
    // console.log("countsForFieldChoice", stories, field1);
    // TODO: Need to add in fields that were not selected with a zero count, using definition from questionnaire
    var counts = {};
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        if (value1 === null || value1 === undefined) continue; // value1 = "{N/A}";
        increment(counts, "" + value1);
    }
    return counts;
}
*/

function increment(countHolder, fieldName) {
    var count = countHolder[fieldName];
    if (!count) count = 0;
    count++;
    countHolder[fieldName] = count;
}

function valueTag(field1, field2) {
    if (field1 === null || field1 === undefined) field1 = "{N/A}";
    if (field2 === null || field2 === undefined) field2 = "{N/A}";
    var result = JSON.stringify([field1, field2]);
    // console.log("valueTag", result);
    return result;
}

function countsForTableChoices(stories: surveyCollection.Story[], field1, field2) {
    // console.log("countsForFieldChoices", stories, field1, field2);
    // TODO: Maybe need to add in fields that were not selected with a zero count, using definition from questionnaire?
    var counts = {};
    var field1Options = {};
    var field2Options = {};
    var total = 0;
    for (var i = 0; i < stories.length; i++) {
        var value1 = stories[i].fieldValue(field1);
        if (value1 === null || value1 === undefined) continue; // value1 = "{N/A}";
        var value2 = stories[i].fieldValue(field2);
        if (value2 === null || value2 === undefined) continue; // value2 = "{N/A}";
        increment(counts, valueTag(value1, value2));
        increment(field1Options, "" + value1);
        increment(field2Options, "" + value2);
        total++;
    }
    var result = {counts: counts, field1Options: field1Options, field2Options: field2Options, total: total};
    // console.log("countsForTableChoices", result);
    return result;
}

/*
function collectValues(valueHolder) {
    var values = [];
    for (var key in valueHolder) {
        values.push(valueHolder[key]);
    }
    return values;
}
*/

// TODO: Next two functions from add_storyBrowser and so are duplicate code

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, model) {
    var storyCardDiv = storyCardDisplay.generateStoryCardContent(model);
    
     return storyCardDiv;
}

function makeItemPanelSpecificationForQuestions(questions) {
    // TODO: add more participant and survey info, like timestamps and participant ID
    
    var storyItemPanelSpecification = {
         id: "patternBrowserQuestions",
         modelClass: "Story",
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

class PatternExplorer {
    project: Project = null;
    catalysisReportIdentifier: string = null;
    catalysisReportObservationSetIdentifier: string = null;
    
    questionsToInclude = null;
    modelForPatternsGrid = {patterns: []};
    patternsGrid: GridWithItemPanel;
    
    graphHolder: GraphHolder;
    
    questions = [];
    
    modelForStoryGrid = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: GridDisplayConfiguration = null;
    storyGrid: GridWithItemPanel = null;
     
    currentPattern = null;
    
    observationPanelSpecification = null;
    
    minimumStoryCountRequiredForTest = defaultMinimumStoryCountRequiredForTest;
    
    constructor(args) {
        this.project = Globals.project();
         
       // Graph display initialization
        
       this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null
        };
        
        // Story grid initialization
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);

        var storyGridConfiguration = {
            idProperty: "storyID",
            columnsToDisplay: ["storyName", "storyText"],
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
            // TODO: Why is gridConfiguration in here twice?
            gridConfiguration: storyGridConfiguration
        };

        this.storyGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForStoryGrid, fieldSpecification: this.storyGridFieldSpecification});

        // Observation panel initialization
        
        this.observationPanelSpecification = {
            "id": "observationPanel",
            panelFields: [        
                {
                    id: "observationPanel_insertGraphSelection",
                    displayPrompt: "Save graph selection",
                    displayType: "button",
                    displayPreventBreak: true,
                    displayConfiguration: this.insertGraphSelection.bind(this)
                },
                {
                    id: "observationPanel_resetGraphSelection",
                    displayPrompt: "Display chosen graph selection",
                    displayType: "button",
                    displayConfiguration: this.resetGraphSelection.bind(this)
                },
                {
                    id: "observationPanel_description",
                    valuePath: "currentObservationDescription",
                    displayName: "Observation",
                    displayPrompt: "If this pattern is noteworthy, enter an <strong>observation</strong> about the pattern here.",
                    displayType: "textarea"
                },
                {
                    id: "observationPanel_title",
                    valuePath: "currentObservationTitle",
                    displayName: "Observation",
                    displayPrompt: "Enter an <strong>summary title</strong> about the pattern here.",
                    displayType: "text"
                    // Maybe TODO: Tab order problem if hide this is not visible when tab out of previous field -- it will skip to page notes
                    // displayVisible: function(panelBuilder, model) {
                    //     return model.currentObservationDescription();
                    // }
                },
                {
                    id: "observationPanel_interpretationsList",
                    valuePath: "currentObservationInterpretations",
                    valueType: "array",
                    displayType: "grid",
                    displayConfiguration: "panel_addInterpretation",
                    displayName: "Interpretation",
                    displayPrompt: "Enter at least two <strong>competing interpretations</strong> for the observation here.",
                    displayVisible: function(panelBuilder, model) {
                        return model.currentObservationDescription() || model.currentObservationTitle();
                    }
                }
            ]
        };
        
        // Pattern grid initialization
        
        this.questionsToInclude = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionsToInclude"); 
        this.modelForPatternsGrid.patterns = this.buildPatternList();
        
        var patternsGridConfiguration = {
            idProperty: "id",
            columnsToDisplay: true,
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
        
        // TODO: selections in observation should be stored in original domain units, not scaled display units
 
        // Put up a "please pick pattern" message
        this.chooseGraph(null);
    }
    
    static controller(args) {
        // console.log("Making PatternBrowser: ", args);
        return new PatternExplorer(args);
    }
    
    static view(controller, args) {
        // console.log("PatternBrowser view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // console.log("%%%%%%%%%%%%%%%%%%% PatternBrowser view called");
        var panelBuilder: PanelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        var catalysisReportIdentifier = this.getCurrentCatalysisReportIdentifier(args);
        if (catalysisReportIdentifier !== this.catalysisReportIdentifier) {
            this.catalysisReportIdentifier = catalysisReportIdentifier;
            // console.log("storyCollectionIdentifier changed", this.catalysisReportIdentifier);
            this.currentCatalysisReportChanged(this.catalysisReportIdentifier);
        }
        
        var parts;
        
        function isMissingQuestionsToInclude(questionsToInclude) {
            if (!questionsToInclude) return true;
            for (var keys in questionsToInclude) {
                return false;
            }
            return true; 
        }
        
        if (!this.catalysisReportIdentifier) {
            parts = [m("div.narrafirma-choose-catalysis-report", "Please select a catalysis report to work with.")];
        } else if (isMissingQuestionsToInclude(this.questionsToInclude)) {
            parts = [m("div.narrafirma-choose-questions-to-include", "Please select some questions to include in the report (on the previous page).")];
        } else {
            parts = [
                this.patternsGrid.calculateView(),
                this.currentPattern ?
                    [
                        m("div", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                        this.storyGrid.calculateView(),
                        panelBuilder.buildPanel(this.observationPanelSpecification, this)
                    ] :
                    // TODO: Translate
                    m("div.narrafirma-choose-pattern", "Please select a pattern to view as a graph")
            ];
        }
        
        // TODO: Need to set class
        return m("div", parts);
    }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            // console.log("appending graph element");
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    observationAccessor(pattern, field: string, newValue = undefined) {
        if (!this.catalysisReportObservationSetIdentifier) throw new Error("observationAccessor: this.catalysisReportObservationSetIdentifier is undefined");
        var patternReference = this.patternReferenceForQuestions(pattern.questions);
         
        var observationIdentifier: string = this.project.tripleStore.queryLatestC(this.catalysisReportObservationSetIdentifier, patternReference);
        
        if (!observationIdentifier) {
            if (field !== "observationInterpretations" && newValue === undefined) return "";
            // Lazy initialize the observation as will need to return a list which might be empty but could get used
            observationIdentifier = generateRandomUuid("Observation");
            // TODO: Ideally should not be creating entry just for looking at it
            this.project.tripleStore.addTriple(this.catalysisReportObservationSetIdentifier, patternReference, observationIdentifier);
            // Need this for printing later so know what questions & pattern go with the observation
            var patternCopyWithoutAccessorFunction = {
                id: pattern.id,
                graphType: pattern.graphType,
                patternName: pattern.patternName,
                questions: pattern.questions
            };
            this.project.tripleStore.addTriple(observationIdentifier, "pattern", patternCopyWithoutAccessorFunction);
        }

        console.log("observationAccessor", pattern.questions, observationIdentifier, newValue);
        if (newValue === undefined) {
            var result = this.project.tripleStore.queryLatestC(observationIdentifier, field);
            if (result === undefined || result === null) {
                result = "";
            }
            // console.log("observationAccessor", this.catalysisReportIdentifier, this.catalysisReportObservationSetIdentifier, patternReference, observation);
            return result;
        } else {
            this.project.tripleStore.addTriple(observationIdentifier, field, newValue);
            return newValue;
        }
    }
    
    currentObservationDescription(newValue = undefined) {
        if (!this.currentPattern) {
            return "";
            // throw new Error("pattern is not defined");
        }
        return this.observationAccessor(this.currentPattern, "observationDescription", newValue);
    }
    
    currentObservationTitle(newValue = undefined) {
        if (!this.currentPattern) {
            return "";
            // throw new Error("pattern is not defined");
        }
        return this.observationAccessor(this.currentPattern, "observationTitle", newValue);
    }
    
    currentObservationInterpretations(newValue = undefined) {
        if (!this.currentPattern) {
            return "";
            // throw new Error("pattern is not defined");
        }
        return this.observationAccessor(this.currentPattern, "observationInterpretations", newValue);
    }
    
    // We don't make the set when the report is created; lazily make it if needed now
    getObservationSetIdentifier(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("getObservationSetIdentifier: catalysisReportIdentifier is not defined"); 
        }
        
        var setIdentifier = this.project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
        
        if (!setIdentifier) {
            setIdentifier = generateRandomUuid("ObservationSet");
            this.project.tripleStore.addTriple(catalysisReportIdentifier, "catalysisReport_observations", setIdentifier);
        }

        return setIdentifier;
    }
    
    currentCatalysisReportChanged(catalysisReportIdentifier) {
        // console.log("currentCatalysisReportChanged", catalysisReportIdentifier);
        
        if (!catalysisReportIdentifier) {
            // TODO: should clear everything
            return;
        }
        
        var minimumStoryCountRequiredForTest = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "minimumSubsetSize");
        if (minimumStoryCountRequiredForTest) {
            this.minimumStoryCountRequiredForTest = parseInt(minimumStoryCountRequiredForTest, 10);
        } else {
            this.minimumStoryCountRequiredForTest = defaultMinimumStoryCountRequiredForTest;
        }
        console.log("minimumStoryCountRequiredForTest", this.minimumStoryCountRequiredForTest);
        
        this.catalysisReportObservationSetIdentifier = this.getObservationSetIdentifier(catalysisReportIdentifier);
        
        this.graphHolder.allStories = this.project.storiesForCatalysisReport(catalysisReportIdentifier);
        // console.log("allStories", this.graphHolder.allStories);
        
        // TODO: Filter these questions by ones of interest for specific catalysis report
        this.questions = questionnaireGeneration.collectAllQuestions();
        // console.log("questions", this.questions);
        
        this.questionsToInclude = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionsToInclude"); 
        this.modelForPatternsGrid.patterns = this.buildPatternList();
        // console.log("patterns", this.modelForPatternsGrid.patterns);
        this.patternsGrid.updateData();

        // Update item panel in story list so it has the correct header
        this.storyGridFieldSpecification.itemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);
        this.storyGrid.updateDisplayConfigurationAndData(this.storyGridFieldSpecification);
    
        this.chooseGraph(null);     
    }
    
    // TODO: Similar to what is in add_graphBrowser
    getCurrentCatalysisReportIdentifier(args) {
        var model = args.model;
        var fieldSpecification = args.fieldSpecification;
        
        // Get selected catalysis report
        var catalysisReportShortName = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification)();
        
        // console.log("catalysisReportShortName", catalysisReportShortName);
        
        if (!catalysisReportShortName) return null;
        
        return this.project.findCatalysisReport(catalysisReportShortName);
    }
    
    patternReferenceForQuestions(questions) {
        // TODO: Maybe should be object instead of array?
        var result = [];
        questions.forEach(function (question) {
            result.push(question.id);
        });
        return {setItem: result};
    }
    
    makePattern(id, graphType, questions) {
        var pattern; 

        if (questions.length === 1) {
            pattern = {id: id, observation: null, graphType: graphType, patternName: nameForQuestion(questions[0]), questions: questions};
        } else if (questions.length === 2) {
            pattern = {id: id, observation: null, graphType: graphType, patternName: nameForQuestion(questions[0]) + " vs. " + nameForQuestion(questions[1]), questions: questions};
        } else {
            console.log("Unexpected number of questions", questions);
            throw new Error("Unexpected number of questions: " + questions.length);
        }
        
        var observation = this.observationAccessor.bind(this, pattern, "observationDescription");
        
        // Next assignment creates a circular reference
        pattern.observation = observation;
        
        return pattern;
    }

    buildPatternList() {
        var result = [];
        var nominalQuestions = [];
        var ratioQuestions = [];
        
        if (!this.questionsToInclude) return result;
        
        // TODO: create all supported graphable permutations of questions
        this.questions.forEach((question) => {
            // Skip questions that are not included in configuration
            if (this.questionsToInclude[question.id]) {
                if (question.displayType === "slider") {
                    ratioQuestions.push(question);
                } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
                    // Ony use text questions that are annotations
                    if (question.displayType === "text" && (question.id || "").substring(2) !== "A_") return;
                    nominalQuestions.push(question);
                }
            }
        });
        
        var questionCount = 0;
        function nextID() {
            return ("00000" + questionCount++).slice(-5);
        }
     
        nominalQuestions.forEach((question1) => {
            result.push(this.makePattern(nextID(), "bar", [question1]));
        });
        
        // Prevent mirror duplicates and self-matching questions
        var usedQuestions;
        
        usedQuestions = [];
        nominalQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            nominalQuestions.forEach((question2) => {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push(this.makePattern(nextID(), "table", [question1, question2]));
            });
        });
        
        ratioQuestions.forEach((question1) => {
            result.push(this.makePattern(nextID(), "histogram", [question1]));
        });
        
        ratioQuestions.forEach((question1) => {
            nominalQuestions.forEach((question2) => {
                result.push(this.makePattern(nextID(), "multiple histogram", [question1, question2]));
            });
        });
        
        usedQuestions = [];
        ratioQuestions.forEach((question1) => {
            usedQuestions.push(question1);
            ratioQuestions.forEach((question2) => {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push(this.makePattern(nextID(), "scatter", [question1, question2]));
            });
        });
        
        /* TODO: For later
        ratioQuestions.forEach((question1) => {
            ratioQuestions.forEach((question2) => {
                nominalQuestions.forEach((question3) => {
                    result.push(this.makePattern(nextID(), "multiple scatter", [question1, question2, question3]});
                });
            });
        });
        */
    
        result.forEach((pattern) => {
            this.calculateStatisticsForPattern(pattern);        
        });
        
        // console.log("buildPatternsList", result);
        return result;
    }
    
    calculateStatisticsForPattern(pattern) {
        var graphType = pattern.graphType;
        
        if (graphType === "bar") {
            this.calculateStatisticsForBarGraph(pattern);
        } else if (graphType === "table") {
            this.calculateStatisticsForTable(pattern);
        } else if (graphType === "histogram") {
            this.calculateStatisticsForHistogram(pattern);
        } else if (graphType === "multiple histogram") {
            this.calculateStatisticsForMultipleHistogram(pattern);
        } else if (graphType === "scatter") {
            this.calculateStatisticsForScatterPlot(pattern);
        } else if (graphType ===  "multiple scatter") {
            console.log("ERROR: Not suported graphType: " + graphType);
            throw new Error("ERROR: Not suported graphType: " + graphType);
        } else {
            console.log("ERROR: Unexpected graphType: " + graphType);
            throw new Error("ERROR: Not suported graphType: " + graphType);
        }
    }
    
    calculateStatisticsForBarGraph(pattern) {
        // not calculating statistics for bar graph
        pattern.significance = "N/A";
    }
    
    calculateStatisticsForHistogram(pattern) {
        // TODO: ? look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
        // TODO: Fix this - could report on normality
        
        // var stories = this.graphHolder.allStories;
        // var counts = collectDataForField(stories, pattern.questions[0].id);
        // console.log("counts", counts);
        
        pattern.significance = "N/A";
    }
    
    calculateStatisticsForMultipleHistogram(pattern) {
        // One of each continuous and not
        // for each option, look for differences of means on a distribution using Student's T test if normal, otherwise Kruskal-Wallis or maybe Mann-Whitney
        
        // TODO: use t-test when normal 

        var ratioQuestion = pattern.questions[0];
        var nominalQuestion = pattern.questions[1];
        
        // Can't calculate a statistic if one or both are mutiple answer checkboxes
        if (nominalQuestion.displayType === "checkboxes") {
            pattern.significance = "N/A (checkboxes)";
            return;
        }
        
        var stories: surveyCollection.Story[] = this.graphHolder.allStories;

        // var data = collectDataForField(stories, nominalQuestion.id);
        // var counts = countsForFieldChoice(stories, nominalQuestion.id);
        var values = valuesForFieldChoices(stories, ratioQuestion.id, nominalQuestion.id);
        var options = Object.keys(values);
        
        // console.log("calculateStatisticsForMultipleHistogram options", options, values);
        
        // For every pair, compute test, and take best p score
        var pLowest = 1;
        
        for (var i = 0; i < options.length; i++) {
            var x = values[options[i]];
            for (var j = i + 1; j < options.length; j++) {
                var y = values[options[j]];
                var statResult = mannWhitneyU(x, y);
                // console.log("calculateStatisticsForMultipleHistogram statResult", statResult);
                pLowest = Math.min(pLowest, statResult.p);
            }
        }
 
        pattern.significance = " p=" + pLowest.toFixed(3);
    }
    
    calculateStatisticsForScatterPlot(pattern) {
        // TODO: both continuous -- look for correlation with Pearson's R (if normal distribution) or Spearman's R / Kendall's Tau (if not normal distribution)"
        var stories: surveyCollection.Story[] = this.graphHolder.allStories;
        var data = collectXYDataForFields(stories, pattern.questions[0].id, pattern.questions[1].id);
        
        // TODO: Add a flag somewhere to use Kendall's Tau instead of Pearson/Spearman's R
        // var statResult = kendallsTau(data.x, data.y);
        // pattern.significance = statResult.prob.toFixed(4);
        
        // TODO: Use Pearson's R instead of Spearman if normally distributed
        var r = jStat.spearmancoeff(data.x, data.y);
        // https://en.wikipedia.org/wiki/Spearman's_rank_correlation_coefficient#Determining_significance
        var n = data.x.length;
        var t = r * Math.sqrt((n - 2.0) / (1.0 - r * r));
        var p = jStat.ttest(t, n, 2);
        pattern.significance = " p=" + p.toFixed(3) + " r=" + r.toFixed(3) + " n=" + n;
        //  + " tt=" + statResult.test.toFixed(3) + " tz=" + statResult.z.toFixed(3) + " tp=" + statResult.prob.toFixed(3) ;
        // console.log("calculateStatisticsForScatterPlot", pattern, n, t, p);
    }
    
    calculateStatisticsForTable(pattern) {
        // both not continuous -- look for a 'correspondence' between counts using Chi-squared test
        // Can't calculate a statistic if one or both are mutiple answer checkboxes
        // TODO: Fix this
        // TODO: test for missing patterns[1]
        
        // console.log("calculateStatisticsForTable", pattern);
        
        if (pattern.questions[0].displayType === "checkboxes" || pattern.questions[1].displayType === "checkboxes") {
            pattern.significance = "N/A (checkboxes)";
            return;
        }
        
        var stories = this.graphHolder.allStories;
        
        var counts = countsForTableChoices(stories, pattern.questions[0].id, pattern.questions[1].id);
        // console.log("counts", counts);
        
        var observed = [];
        var expected = [];
        
        for (var field1Option in counts.field1Options) {
            for (var field2Option in counts.field2Options) {
                var field1Total = counts.field1Options[field1Option];
                var field2Total = counts.field2Options[field2Option];
                var observedValue = counts.counts[valueTag(field1Option, field2Option)] ||  0;
                observed.push(observedValue);
                var expectedValue = field1Total * field2Total / counts.total;
                expected.push(expectedValue);
            }
        }
        
        var n1 = Object.keys(counts.field1Options).length;
        var n2 = Object.keys(counts.field2Options).length;
        
        var degreesOfFreedom = (n1 - 1) * (n2 - 1);        
        
        // Conditions needed for test according to: https://en.wikipedia.org/wiki/Pearson's_chi-squared_test
        var tooLowCount = 0;
        var zeroInCell = false;
        for (var i = 0; i < expected.length; i++) {
            if (expected[i] < 5) tooLowCount++;
            if (expected[i] === 0) zeroInCell = true;
        }
        
        if (zeroInCell) {
            pattern.significance = "N/A (zero in expected cell)";
            return;
        }
        
        if (n1 <= 2 && n2 <= 2 && tooLowCount > 0) {
            pattern.significance = "N/A (2X2 with expected cell < 5)";
            return;
        }
        
        if (tooLowCount / observed.length > 0.2) {
            pattern.significance = "N/A (less than 80% expected cells >= 5)";
            return;
        }

        // console.log("observed", observed);
        // console.log("expected", expected);
        // console.log("degreesOfFreedom", degreesOfFreedom);
        
        var statResult = chiSquare.chiSquare(observed, expected, degreesOfFreedom);
        // console.log("statResult.n", statResult.n);
        
        if (statResult.n !== n1 * n2) {
            throw new Error("unexpected n1 * n2");
        }
        
        if (statResult.n === degreesOfFreedom) {
            throw new Error("unexpected statResult.n");
        }
        
        pattern.significance = " p=" + statResult.p.toFixed(3) + " x^2=" + statResult.x2.toFixed(3) + " k=" + statResult.k + " n=" + statResult.n;
    }
    
    chooseGraph(pattern) {
        // console.log("chooseGraph", pattern);
        
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

        this.graphHolder.currentGraph = PatternExplorer.makeGraph(pattern, this.graphHolder, this.updateStoriesPane.bind(this));
        this.graphHolder.currentSelectionExtentPercentages = null;
        // TODO: Is this obsolete? this.graphHolder.currentSelectionSubgraph = null;
    }
    
    static makeGraph(pattern, graphHolder, selectionCallback) {
        var graphType = pattern.graphType;
        // var name = pattern.patternName;
        // console.log("patternName", name, graphType);
        var q1 = pattern.questions[0];
        var q2 = pattern.questions[1];
        var newGraph = null;
        switch (graphType) {
            case "bar":
                newGraph = charting.d3BarChart(graphHolder, q1, selectionCallback);
                break;
            case "table":
                newGraph = charting.d3ContingencyTable(graphHolder, q1, q2, selectionCallback);
                break;
            case "histogram":
                newGraph = charting.d3HistogramChart(graphHolder, q1, null, null, selectionCallback);
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                newGraph = charting.multipleHistograms(graphHolder, q2, q1, selectionCallback);
                break;
            case "scatter":
                newGraph = charting.d3ScatterPlot(graphHolder, q1, q2, selectionCallback);
                break;        
           default:
                console.log("ERROR: Unexpected graph type");
                alert("ERROR: Unexpected graph type");
                break;
        }
        
        return newGraph;
    }

    updateStoriesPane(stories) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
    }
    
    patternSelected(selectedPattern) {
        // console.log("selectedPattern in pattern grid", selectedPattern);
        this.chooseGraph(selectedPattern);
        this.currentPattern = selectedPattern;
        
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        this.storyGrid.updateData();
    }
    
    insertGraphSelection() {
        // console.log("insertGraphSelection");
        if (!this.graphHolder.currentGraph) {
            // TODO: Translated
            alert("Please select a pattern first");
            return;
        }
        
        if (!this.graphHolder.currentSelectionExtentPercentages) {
            alert("Please select something in a graph first");
            return;
        }
        
        // console.log("PatternsBrowser currentGraph", this.graphHolder.currentGraph);
        
        if (this.scanForSelectionJSON()) {
            // TODO: Translate
            alert("The insertion would change a previously saved selection within a {...} section;\nplease pick a different insertion point.");
            return;
        }
        
        if (!this.currentPattern) return;
        
        // Find observation textarea and other needed data
        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_description");
        var selection = this.graphHolder.currentSelectionExtentPercentages;
        var textToInsert = JSON.stringify(selection);
        
        // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
        var selectionStart = textarea.selectionStart;
        var selectionEnd = textarea.selectionEnd;
        var oldText = this.currentObservationDescription();
        var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
        this.currentObservationDescription(newText);
        
        // Set the new value explicitly here rather than waiting for a Mithril redraw so that we can then select it
        textarea.value = newText;
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart + textToInsert.length;
        textarea.focus();
    }
    
    scanForSelectionJSON(doFocus = false) {
        // console.log("scanForSelectionJSON");
        // TODO: Fix this for Mithril conversion
        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_description");
        if (!this.currentPattern) return;
        var text = this.currentObservationDescription();
    
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
        // console.log("resetGraphSelection");
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
        
        // console.log("selection from user", selection);
        
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

export = PatternExplorer;