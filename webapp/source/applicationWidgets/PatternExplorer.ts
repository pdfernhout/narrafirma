import charting = require("./charting");
import calculateStatistics = require("../calculateStatistics");
import storyCardDisplay = require("../storyCardDisplay");
import questionnaireGeneration = require("../questionnaireGeneration");
import topic = require("../pointrel20150417/topic");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import dialogSupport = require("../panelBuilder/dialogSupport");
import m = require("mithril");
import Project = require("../Project");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import Globals = require("../Globals");
import _ = require("lodash");
import toaster = require("../panelBuilder/toaster");

"use strict";

//------------------------------------------------------------------------------------------------------------------------------------------
// support types and functions
//------------------------------------------------------------------------------------------------------------------------------------------

// Question types that have choice (not scale) data associated with them for filters and graphs
var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

var patternsPanelSpecification = {
    id: "patternsPanel",
    modelClass: "Pattern",
    panelFields: [
        {id: "id", displayName: "Index"},
        {id: "patternName", displayName: "Pattern name", valueOptions: []},
        {id: "displayNameForQuestion1", displayName: "Question 1", valueOptions: []},
        {id: "displayNameForQuestion2", displayName: "Question 2", valueOptions: []},
        {id: "displayNameForQuestion3", displayName: "Question 3", valueOptions: []},
        {id: "graphType", displayName: "Graph type", valueOptions: []},
        {id: "significance", displayName: "Significance value", valueOptions: []},
        {id: "observation", displayName: "Observation", valueOptions: []},
        {id: "strength", displayName: "Strength", valueOptions: []},
    ]
};

const interpretationsColumnSpec = {id: "interpretations", displayName: "Interpretations", valueOptions: []};

function nameForQuestion(question) {
    if (question.displayName) return question.displayName;
    if (question.displayPrompt) return question.displayPrompt;
    return question.id;
}

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, model) {
    var storyCardDiv = storyCardDisplay.generateStoryCardContent(model, undefined);
    
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
    storyItemPanelSpecification.panelFields.push({id: "indexInStoryCollection", displayName: "Index", valueOptions: []},);
    return storyItemPanelSpecification;
}

function decodeBraces(optionText) {
    return optionText.replace("&#123;", "{").replace("&#125;", "}"); 
}

//------------------------------------------------------------------------------------------------------------------------------------------
// PatternExplorer initialization and setting up interface elements
//------------------------------------------------------------------------------------------------------------------------------------------

class PatternExplorer {
    project: Project = null;
    catalysisReportIdentifier: string = null;
    catalysisReportObservationSetIdentifier: string = null;
    questionsToInclude = null;
    modelForPatternsGrid = {patterns: []};
    patternsGridFieldSpecification: any = null;
    patternsGrid: GridWithItemPanel;
    graphHolder: GraphHolder;
    questions = [];
    numStoryCollectionsIncludedInReport = 0;
    modelForStoryGrid = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: any = null;
    storyGrid: GridWithItemPanel = null;
    currentPattern = null;
    observationPanelSpecification = null;
    interpretationsPanelSpecification = null;
    thingsYouCanDoPanelSpecification = null;
    textAnswersPanelSpecification = null;
    minimumStoryCountRequiredForTest = Project.defaultMinimumStoryCountRequiredForTest;
    minimumStoryCountRequiredForGraph = Project.defaultMinimumStoryCountRequiredForGraph;
    numHistogramBins = Project.defaultNumHistogramBins;
    showInterpretationsInGrid = Project.defaultShowInterpretationsInGrid;
    graphMultiChoiceQuestionsAgainstThemselves = Project.defaultGraphMultiChoiceQuestionsAgainstThemselves;
    numScatterDotOpacityLevels = Project.defaultNumScatterDotOpacityLevels;
    scatterDotSize = Project.defaultScatterDotSize;
    correlationLineChoice = Project.defaultCorrelationLineChoice;
    outputGraphFormat = Project.defaultOutputGraphFormat;
    graphTypesToCreate = Project.defaultGraphTypesToCreate;
    
    constructor(args) {
        this.project = Globals.project();
        
       this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            minimumStoryCountRequiredForTest: Project.defaultMinimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: Project.defaultMinimumStoryCountRequiredForGraph,
            numHistogramBins: Project.defaultNumHistogramBins,
            numScatterDotOpacityLevels: Project.defaultNumScatterDotOpacityLevels,
            scatterDotSize: Project.defaultScatterDotSize,
            correlationLineChoice: Project.defaultCorrelationLineChoice,
            outputGraphFormat: Project.defaultOutputGraphFormat,
            graphTypesToCreate: Project.defaultGraphTypesToCreate
        };
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);
        var storyGridConfiguration = {
            idProperty: "storyID",
            columnsToDisplay: ["indexInStoryCollection", "storyName", "storyText"],
            viewButton: true,
            navigationButtons: true
        };

        this.storyGridFieldSpecification = {
            id: "storiesSelectedInGraph",
            itemPanelID: undefined,
            // TODO: Why is itemPanelSpecification in here twice (also in displayConfiguration)?
            itemPanelSpecification: storyItemPanelSpecification,
            displayConfiguration: {
                itemPanelSpecification: storyItemPanelSpecification,
                gridConfiguration: storyGridConfiguration
            },
            // TODO: Why is gridConfiguration in here twice (also in displayConfiguration)?
            gridConfiguration: storyGridConfiguration
        };
        this.storyGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForStoryGrid, fieldSpecification: this.storyGridFieldSpecification});

        this.thingsYouCanDoPanelSpecification = {
            "id": "thingsYouCanDoPanel",
            panelFields: [ 
                {
                    id: "thingsYouCanDoPanel_actionRequested",
                    valuePath: "selectionActionRequested",
                    displayPrompt: "These are some <strong>things you can do</strong> based on the selection you have made in the graph above.",
                    displayType: "select",
                    displayWithoutQuestionDivs: true,
                    valueOptions: [
                        "Show selected stories in separate window for copying", 
                        "Show random sample of 10 selected stories", 
                        "Show random sample of 20 selected stories", 
                        "Show random sample of 30 selected stories",
                        "Save the current selection (it will appear in the text box below)",
                        "Restore a saved selection (from the text box below; position your cursor inside it first)"],
                },
                {
                    id: "thingsYouCanDoPanel_doThingsWithSelectedStories",
                    displayPrompt: "Do it",
                    displayType: "button",
                    displayPreventBreak: true,
                    displayConfiguration: this.doThingsWithSelectedStories.bind(this),
                }, 
                {
                    id: "thingsYouCanDoPanel_savedGraphSelections",
                    valuePath: "currentObservationSavedGraphSelections",
                    displayName: "Graph selections",
                    displayPrompt: 'These are <strong>selections you have saved</strong> for this graph.',
                    displayType: "text",
                },
                
            ]};

        this.textAnswersPanelSpecification = {
            "id": "textAnswersPanel",
            panelFields: [
                {
                    id: "textAnswersPanel_texts",
                    valuePath: "currentTextAnswers",
                    displayName: "Text answers",
                    displayPrompt: "These are the <strong>answers</strong> your participants gave to this text question. They are sorted alphabetically. Answers with a number in parentheses were entered more than once. To include any of these answers in your catalysis report, copy and paste them into your observation.",
                    displayType: "textarea",
                    }
            ]
        }
        
        this.observationPanelSpecification = {
            "id": "observationPanel",
            panelFields: [        
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
                    displayPrompt: "Please give this observation a short <strong>name</strong>.",
                    displayType: "text"
                },
                {
                    id: "observationPanel_strength",
                    valuePath: "currentObservationStrength",
                    displayName: "Observation",
                    displayPrompt: "How <strong>strong</strong> is this pattern?",
                    displayType: "select",
                    valueOptions: ["1 (weak)", "2 (medium)", "3 (strong)"]
                },
            ]
        };
        this.interpretationsPanelSpecification = {
            "id": "interpretationsPanel",
            panelFields: [        
                {
                    id: "interpretationsPanel_interpretationsList",
                    valuePath: "currentObservationInterpretations",
                    valueType: "array",
                    displayType: "grid",
                    displayConfiguration: "panel_addInterpretation",
                    displayName: "Interpretations",
                    displayPrompt: "Enter at least two <strong>competing interpretations</strong> for the observation here.",
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
            itemPanelID: undefined,
            // TODO: Why is itemPanelSpecification in here twice (also in displayConfiguration)?
            itemPanelSpecification: patternsPanelSpecification,
            displayConfiguration: {
                itemPanelSpecification: patternsPanelSpecification,
                gridConfiguration: patternsGridConfiguration
            },
            // TODO: Why is gridConfiguration in here twice (also in displayConfiguration)?
            gridConfiguration: patternsGridConfiguration
        };
        this.patternsGridFieldSpecification = patternsGridFieldSpecification;
        this.patternsGrid = new GridWithItemPanel({panelBuilder: args.panelBuilder, model: this.modelForPatternsGrid, fieldSpecification: patternsGridFieldSpecification});

        // TODO: selections in observation should be stored in original domain units, not scaled display units
        
        // Put up a "please pick pattern" message
        this.chooseGraph(null);
    }
    
    static controller(args) {
        return new PatternExplorer(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    calculateView(args) {
        var panelBuilder: PanelBuilder = args.panelBuilder;
        
        // Handling of caching of questions and stories
        var catalysisReportIdentifier = this.getCurrentCatalysisReportIdentifier(args);
        if (catalysisReportIdentifier !== this.catalysisReportIdentifier) {
            this.catalysisReportIdentifier = catalysisReportIdentifier;
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

        function isMissingGraphTypesToCreate(graphTypesToCreate) {
            if (!graphTypesToCreate) return true;
            for (var key in graphTypesToCreate) {
                if (graphTypesToCreate[key]) return false;
            }
            return true; 
        }

        if (!this.catalysisReportIdentifier) {
            parts = [m("div.narrafirma-choose-catalysis-report", "Please select a catalysis report to work with.")];
        } else if (isMissingQuestionsToInclude(this.questionsToInclude)) {
            parts = [m("div.narrafirma-choose-questions-to-include", "Please select some questions to include in the report (on the previous page).")];
        } else if (isMissingGraphTypesToCreate(this.graphTypesToCreate)) {
            parts = [m("div.narrafirma-choose-graph-types-to-include", "Please select some graph types to include in the report (on the previous page).")];
        } else {
            const patternsAndStrengthsDisplayText = this.patternsAndStrengthsDisplayText();
            if (this.currentPattern && this.currentPattern.graphType === "data integrity") {
                parts = [
                    m("div.patterns-grid-header", patternsAndStrengthsDisplayText),
                    this.patternsGrid.calculateView(),
                    m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                    panelBuilder.buildPanel(this.observationPanelSpecification, this),
                    this.currentObservationHasTitleOrDescription() ? panelBuilder.buildPanel(this.interpretationsPanelSpecification, this) : m("div"),
                ];
            } else if (this.currentPattern && this.currentPattern.graphType === "texts") {
                parts = [
                    m("div.patterns-grid-header", patternsAndStrengthsDisplayText),
                    this.patternsGrid.calculateView(),
                    panelBuilder.buildPanel(this.textAnswersPanelSpecification, this),
                    panelBuilder.buildPanel(this.observationPanelSpecification, this),
                    this.currentObservationHasTitleOrDescription() ? panelBuilder.buildPanel(this.interpretationsPanelSpecification, this) : m("div"),
                ];
            } else { 
                const numStories = this.modelForStoryGrid.storiesSelectedInGraph.length;
                const storyOrStoriesWord = (numStories > 1) ? "stories" : "story";
                var selectedStoriesText = "" + numStories + " " + storyOrStoriesWord + " in selection - " + this.nameForCurrentGraphSelection();
                parts = [
                    m("div.patterns-grid-header", patternsAndStrengthsDisplayText),
                    this.patternsGrid.calculateView(),
                    this.currentPattern ?
                        [
                            m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                            (this.modelForStoryGrid.storiesSelectedInGraph.length > 0) ? 
                                m("div", {"class": "narrafirma-pattern-browser-selected-stories-header"}, selectedStoriesText) : m("div"),
                            (this.modelForStoryGrid.storiesSelectedInGraph.length > 0) ? this.storyGrid.calculateView() : m("div"),
                            panelBuilder.buildPanel(this.thingsYouCanDoPanelSpecification, this),
                            //panelBuilder.buildPanel(this.savedGraphReferencesPanelSpecification, this),
                            panelBuilder.buildPanel(this.observationPanelSpecification, this),
                            this.currentObservationHasTitleOrDescription() ? panelBuilder.buildPanel(this.interpretationsPanelSpecification, this) : m("div"),
                        ] :
                        // TODO: Translate
                        m("div.narrafirma-choose-pattern", "Please select a pattern to view as a graph.")
                ];
            }
        }
        return m("div.narrafirma-patterns-grid", parts);
    }

    currentCatalysisReportChanged(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            return;
        }
        this.minimumStoryCountRequiredForTest = this.project.minimumStoryCountRequiredForTest(catalysisReportIdentifier);
        this.minimumStoryCountRequiredForGraph = this.project.minimumStoryCountRequiredForGraph(catalysisReportIdentifier);
        this.graphHolder.minimumStoryCountRequiredForTest = this.minimumStoryCountRequiredForTest; 
        this.graphHolder.minimumStoryCountRequiredForGraph = this.minimumStoryCountRequiredForGraph;
        this.numHistogramBins = this.project.numberOfHistogramBins(catalysisReportIdentifier);
        this.graphHolder.numHistogramBins = this.numHistogramBins; 
        this.showInterpretationsInGrid = this.project.showInterpretationsInGrid(catalysisReportIdentifier);
        this.graphMultiChoiceQuestionsAgainstThemselves = this.project.graphMultiChoiceQuestionsAgainstThemselves(catalysisReportIdentifier);
        this.numScatterDotOpacityLevels = this.project.numScatterDotOpacityLevels(catalysisReportIdentifier);
        this.graphHolder.numScatterDotOpacityLevels = this.numScatterDotOpacityLevels;
        this.scatterDotSize = this.project.scatterDotSize(catalysisReportIdentifier);
        this.graphHolder.scatterDotSize = this.scatterDotSize;
        this.correlationLineChoice = this.project.correlationLineChoice(catalysisReportIdentifier);
        this.graphHolder.correlationLineChoice = this.correlationLineChoice; 
        this.graphHolder.outputGraphFormat = this.project.outputGraphFormat(catalysisReportIdentifier);
        this.graphTypesToCreate = this.project.graphTypesToCreate(catalysisReportIdentifier);
        
        this.catalysisReportObservationSetIdentifier = this.getObservationSetIdentifier(catalysisReportIdentifier);
        this.graphHolder.allStories = this.project.storiesForCatalysisReport(catalysisReportIdentifier);

        var leadingStoryQuestions = questionnaireGeneration.getStoryNameAndTextQuestions();
        var elicitingQuestions = this.project.elicitingQuestionsForCatalysisReport(catalysisReportIdentifier);
        var numStoriesToldQuestions = this.project.numStoriesToldQuestionsForCatalysisReport(catalysisReportIdentifier);
        var storyLengthQuestions = this.project.storyLengthQuestionsForCatalysisReport(catalysisReportIdentifier);
        var storyQuestions = this.project.storyQuestionsForCatalysisReport(catalysisReportIdentifier); 
        var participantQuestions = this.project.participantQuestionsForCatalysisReport(catalysisReportIdentifier);
        var annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        this.questions = [];
        this.questions = this.questions.concat(leadingStoryQuestions, elicitingQuestions, numStoriesToldQuestions, storyLengthQuestions, storyQuestions, participantQuestions, annotationQuestions);
        this.questionsToInclude = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionsToInclude"); 
        this.numStoryCollectionsIncludedInReport = this.project.numStoryCollectionsInCatalysisReport(catalysisReportIdentifier);

        if (this.showInterpretationsInGrid) {
            let hasColumnAlready = false;
            for (var index = 0; index < patternsPanelSpecification.panelFields.length; index++) {
                if (patternsPanelSpecification.panelFields[index].displayName === "Interpretations") {
                    hasColumnAlready = true;
                    break;
                }
            }
            if (!hasColumnAlready) patternsPanelSpecification.panelFields.push(interpretationsColumnSpec);
        }
        else {
            patternsPanelSpecification.panelFields =
                patternsPanelSpecification.panelFields.filter(function (each) { return each.displayName !== "Interpretations"; });
        }
        this.patternsGrid.updateDisplayConfigurationAndData(this.patternsGridFieldSpecification);
        this.modelForPatternsGrid.patterns = this.buildPatternList();
        this.patternsGrid.updateData();

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
        
        if (!catalysisReportShortName) return null;
        
        return this.project.findCatalysisReport(catalysisReportShortName);
    }
    
    currentTextAnswers() {
        if (!this.catalysisReportObservationSetIdentifier) throw new Error("currentTextAnswers: this.catalysisReportObservationSetIdentifier is undefined");
        if (!this.currentPattern) return "";
        if (!this.currentPattern.questions[0]) return "";
        if (!this.graphHolder.allStories) return "";

        var questionID = this.currentPattern.questions[0].id; 
        var stories = this.graphHolder.allStories; 
        var answers = {};
        var answerKeys = [];

        stories.forEach(function (story) {
            var text = story.fieldValue(questionID);
            if (text) {
                if (!answers[text]) {
                    answers[text] = 0;
                    answerKeys.push(text);
                }
                answers[text] += 1;
            }
        });
        answerKeys.sort();
        
        var sortedAndFormattedAnswers = "";
        for (var i = 0; i < answerKeys.length; i++) {
            var answer = answerKeys[i];
            sortedAndFormattedAnswers += answer;
            if (answers[answer] > 1) sortedAndFormattedAnswers += " (" + answers[answer] + ") ";
            if (i < answerKeys.length - 1) sortedAndFormattedAnswers +=  "\n--------\n";
        }
        return sortedAndFormattedAnswers;
    }
    
    patternsAndStrengthsDisplayText() {
        var result = "";
        var strengthCounts = {"3 (strong)": 0, "2 (medium)": 0, "1 (weak)": 0};
        var numObservationsWithStrengths = 0;
        var numObservationsWithoutStrengths = 0;
        this.modelForPatternsGrid.patterns.forEach(function(pattern) {
            if (pattern.observation()) {
                var strength = pattern.strength();
                if (strength !== "") {
                    strengthCounts[strength] += 1;
                    numObservationsWithStrengths += 1;
                } else {
                    numObservationsWithoutStrengths += 1;
                }
            }
        });
        result = "Showing " + this.modelForPatternsGrid.patterns.length + (this.modelForPatternsGrid.patterns.length !== 1 ? " patterns" : " pattern");
        if (Object.keys(strengthCounts).length) {
            result += " and " + numObservationsWithStrengths + (numObservationsWithStrengths !== 1 ? " observations" : " observation");
            result += ", with strengths of ";
            var keyCount = 0;
            Object.keys(strengthCounts).forEach(function(key) {
                result +=  key + ": " + strengthCounts[key];
                if (keyCount < 2) result += ", ";
                keyCount++;
            });
            result += ", no strength set: " + numObservationsWithoutStrengths;
        }
        return result;
    }
    
//------------------------------------------------------------------------------------------------------------------------------------------
// list of patterns
//------------------------------------------------------------------------------------------------------------------------------------------
    
    buildPatternList() {
        if (!this.questionsToInclude) return [];

        var nominalQuestions = [];
        var scaleQuestions = [];
        var textQuestions = [];
        this.questions.forEach((question) => {
            if (this.questionsToInclude[question.id]) {
                if (question.displayType === "slider") {
                    scaleQuestions.push(question);
                } else if (question.displayType === "text" || question.displayType === "textarea") {
                    textQuestions.push(question);
                } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
                    nominalQuestions.push(question);
                }
            }
        });

        // first check how many patterns there will be, and warn user if the number is very high
        // but only if there are enough questions selected to make it likely that it will matter
        // all of these limits have been selected by trial and error (and could be different on faster computers) 
        var goAhead = true;

        if (this.questionsToInclude && Object.keys(this.questionsToInclude).length > 30) { 

            // the [0] is because we want a count, and when it's building, buildOrCountPatternList returns an array of patterns
            // so the count is just in an array by itself so the function can return an array
            var numPatterns = this.buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, false)[0];
            if (numPatterns > 10000) { // these limits were determined by trial and error
                goAhead = confirm("You are about to generate " + numPatterns + " graphs. " +
                    "This could take a long time. " +
                    "You might want to try selecting fewer questions or graph types. " +
                    "Are you sure you want to do this?");
            } else if (numPatterns > 50000) { // these limits were determined by trial and error
                goAhead = confirm("You are about to generate " + numPatterns + " graphs. " +
                    "This could take a VERY long time, and it could cause your browser to stop responding. " +
                    "You really should select fewer questions and/or graph types. " +
                    "If you are SURE you want to do this, click OK. If your browser freezes, you may have to restart it.");
            }
            if (!goAhead) return []; // the Explore patterns page will appear in this case with nothing in the table, but that's okay
        }

        // now actually generate the patterns
        var result = this.buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, true);

        var patternIndex = 0;
        // if a lot of patterns, use progress dialog, otherwise just calculate (and avoid having a dialog blip onto the screen and off again)
        if (result.length > 200) { // this is an arbitrary number, just a guess as to how long it will take to calculate 
            // first set all stats to "none" in case they cancel partway through
            result.forEach((pattern) => { pattern.significance = "None (calculation cancelled)"; });
            var progressModel = dialogSupport.openProgressDialog("Processing statistics for question combinations", "Generating statistical results...", "Cancel", dialogCancelled);
            // reduce number of times progress message is updated (to speed up process), but show progress at least every 20 graphs so user knows it is working
            var howOftenToUpdateProgressMessage = Math.min(Math.max(Math.floor(result.length/100.0), 1), 20); 
            var stories = this.graphHolder.allStories;
            var minimumStoryCountRequiredForTest = this.minimumStoryCountRequiredForTest;
            setTimeout(function() { calculateStatsForNextPattern(); }, 0);
        } else { // just calculate without any progress dialog
            result.forEach((pattern) => {
                calculateStatistics.calculateStatisticsForPattern(result[patternIndex], patternIndex, result.length, howOftenToUpdateProgressMessage,
                    this.graphHolder.allStories, this.minimumStoryCountRequiredForTest, null); // no progress model
                patternIndex += 1;
            });
        }

        function calculateStatsForNextPattern() {
            if (progressModel.cancelled) {
                toaster.toast("Cancelled after calculating statistics for " + (patternIndex + 1) + " patterns");
            } else if (patternIndex >= result.length) {
                progressModel.hideDialogMethod();
                progressModel.redraw();
            } else {
                calculateStatistics.calculateStatisticsForPattern(result[patternIndex], patternIndex, result.length, howOftenToUpdateProgressMessage,
                    stories, minimumStoryCountRequiredForTest, progressModel);  
                patternIndex += 1;
                setTimeout(function() { calculateStatsForNextPattern(); }, 0);
            }
        }
    
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }

        return result;
    }

    buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, build) {
        var result = [];
        var graphCount = 0;

        function nextID() {
            return ("00000" + graphCount++).slice(-5);
        }

        // data integrity graphs
        if (this.graphTypesToCreate["data integrity graphs"]) {
            if (build) {
                result.push(this.makePattern(nextID(), "data integrity", scaleQuestions, "All scale values"));
                result.push(this.makePattern(nextID(), "data integrity", scaleQuestions, "Participant means"));
                result.push(this.makePattern(nextID(), "data integrity", scaleQuestions, "Participant standard deviations"));
                result.push(this.makePattern(nextID(), "data integrity", nominalQuestions, "Unanswered choice questions"));
                result.push(this.makePattern(nextID(), "data integrity", scaleQuestions, "Unanswered scale questions"));
            } else {
                graphCount += 5;
            }
        }

        // texts
        if (this.graphTypesToCreate["texts"]) {
            textQuestions.forEach((question) => {
                if (build) {
                    result.push(this.makePattern(nextID(), "texts", [question], "Text answers"));
                } else {
                    graphCount++;
                }
            });
        }
     
        // one choice question 
        if (this.graphTypesToCreate["bar graphs"]) {
            nominalQuestions.forEach((question1) => {
                if (build) {
                    result.push(this.makePattern(nextID(), "bar", [question1], null));
                } else {
                    graphCount++;
                }
            });
        };

        // one scale question
        if (this.graphTypesToCreate["histograms"]) {
            scaleQuestions.forEach((question1) => {
                if (build) {
                    result.push(this.makePattern(nextID(), "histogram", [question1], null));
                } else {
                    graphCount++;
                }
            });
        };

        // when creating question combinations, prevent mirror duplicates (axb, bxa) and self-matching questions (axa)
        // unless they want axa for multi-choice questions
        var usedQuestions;
        
        // two choice questions
        if (this.graphTypesToCreate["tables"]) {
            usedQuestions = [];
            nominalQuestions.forEach((question1) => {
                usedQuestions.push(question1);
                nominalQuestions.forEach((question2) => {
                    var okayToGraphQuestionAgainstItself = this.graphMultiChoiceQuestionsAgainstThemselves && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
                    if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                    if (build) {
                        result.push(this.makePattern(nextID(), "table", [question1, question2], null));
                    } else {
                        graphCount++;
                    }
                });
            });
        };

        // two scale questions
        if (this.graphTypesToCreate["scatterplots"]) {
            usedQuestions = [];
            scaleQuestions.forEach((question1) => {
                usedQuestions.push(question1);
                scaleQuestions.forEach((question2) => {
                    if (usedQuestions.indexOf(question2) !== -1) return;
                    if (build) {
                        result.push(this.makePattern(nextID(), "scatter", [question1, question2], null));
                    } else {
                        graphCount++;
                    }
                });
            });
        };

        // one scale question, one choice question
        if (this.graphTypesToCreate["multiple histograms"]) {
            scaleQuestions.forEach((question1) => {
                nominalQuestions.forEach((question2) => {
                    if (build) {
                        result.push(this.makePattern(nextID(), "multiple histogram", [question1, question2], null));
                    } else {
                        graphCount++;
                    }
                });
            });
        };

        // two choice questions, one scale question
        if (this.graphTypesToCreate["contingency-histogram tables"]) {
            usedQuestions = [];
            nominalQuestions.forEach((question1) => {
                usedQuestions.push(question1);
                nominalQuestions.forEach((question2) => {
                    var okayToGraphQuestionAgainstItself = this.graphMultiChoiceQuestionsAgainstThemselves && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
                    if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                    scaleQuestions.forEach((question3) => {
                        if (build) {
                            result.push(this.makePattern(nextID(), "contingency-histogram", [question1, question2, question3], null));
                        } else {
                            graphCount++;
                        }
                    });
                });
            });
        };

        // two scale questions, one choice question
        if (this.graphTypesToCreate["multiple scatterplots"]) {
            usedQuestions = [];
            scaleQuestions.forEach((question1) => {
                usedQuestions.push(question1);
                scaleQuestions.forEach((question2) => {
                    if (usedQuestions.indexOf(question2) !== -1) return;
                    nominalQuestions.forEach((question3) => {
                        if (build) {
                            result.push(this.makePattern(nextID(), "multiple scatter", [question1, question2, question3], null));
                        } else {
                            graphCount++;
                        }
                    });
                });
            });
        };

        if (build) {
            return result;
        } else {
            return [graphCount]; // so there is not a different return type
        }
    }

//------------------------------------------------------------------------------------------------------------------------------------------
// graph of selected pattern 
//------------------------------------------------------------------------------------------------------------------------------------------
    
    chooseGraph(pattern) {
        // Remove old graph(s)
        while (this.graphHolder.chartPanes.length) {
            var chartPane = this.graphHolder.chartPanes.pop();
            this.graphHolder.graphResultsPane.removeChild(chartPane);
            // TODO: Do these need to be destroyed or freed somehow?
        }

        this.graphHolder.excludeStoryTooltips = false; // seems to stay set on
        
        // Need to remove the float end node, if any        
        while (this.graphHolder.graphResultsPane.firstChild) {
            this.graphHolder.graphResultsPane.removeChild(this.graphHolder.graphResultsPane.firstChild);
        }
        
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        
        if (pattern === null) {
            return;
        }
        // tell grid to check to see if row is out of view - was causing problems if user scrolled with scroll bar then clicked in row
        this.patternsGrid.isNavigationalScrollingNeeded = "scrolled";

        this.graphHolder.currentGraph = PatternExplorer.makeGraph(pattern, this.graphHolder, this.updateStoriesPane.bind(this));
        this.graphHolder.currentSelectionExtentPercentages = null;
        // TODO: Is this obsolete? this.graphHolder.currentSelectionSubgraph = null;
    }

    makePattern(id, graphType, questions, patternNameIfDataIntegrity) {
        var pattern; 

        if (graphType == "data integrity") {
            pattern = {id: id, observation: null, graphType: graphType, patternName: patternNameIfDataIntegrity, questions: questions};    
            pattern.displayNameForQuestion1 = "";
            pattern.displayNameForQuestion2 = "";
            pattern.displayNameForQuestion3 = "";
        } else if (questions.length === 1) {
            pattern = {id: id, observation: null, graphType: graphType, patternName: nameForQuestion(questions[0]), questions: questions};
            pattern.displayNameForQuestion1 = questions[0].displayName;
            pattern.displayNameForQuestion2 = "";
            pattern.displayNameForQuestion3 = "";
        } else if (questions.length === 2) {
            pattern = {id: id, observation: null, graphType: graphType, patternName: nameForQuestion(questions[0]) + " x " + nameForQuestion(questions[1]), questions: questions};
            pattern.displayNameForQuestion1 = questions[0].displayName;
            pattern.displayNameForQuestion2 = questions[1].displayName;
            pattern.displayNameForQuestion3 = "";
        } else if (questions.length === 3) {
            pattern = {id: id, observation: null, graphType: graphType, patternName: nameForQuestion(questions[0]) + " x " + nameForQuestion(questions[1]) + " + " + nameForQuestion(questions[2]), questions: questions};
            pattern.displayNameForQuestion1 = questions[0].displayName;
            pattern.displayNameForQuestion2 = questions[1].displayName;
            pattern.displayNameForQuestion3 = questions[2].displayName;
        } else {
            console.log("Unexpected number of questions", questions);
            throw new Error("Unexpected number of questions: " + questions.length);
        }
        
        var observation = () => {
            return this.observationAccessor(pattern, "observationTitle") || this.observationAccessor(pattern, "observationDescription");
        }
        var strength = () => {
            return this.observationAccessor(pattern, "observationStrength") || "";
        };
       
        pattern.observation = observation;  // circular reference
        pattern.strength = strength;

        if (this.showInterpretationsInGrid) {
            const interpretationSetID = this.observationAccessor(pattern, "observationInterpretations");
            const interpretationIDs = this.project.tripleStore.getListForSetIdentifier(interpretationSetID); 
            const interpretationNames = [];
            interpretationIDs.forEach(id => {
                const itemName = this.project.tripleStore.queryLatestC(id, "interpretation_name");
                interpretationNames.push(itemName);
            });
            pattern.interpretations = interpretationNames.join("\n");
        }
        
        return pattern;
    }

    static makeGraph(pattern, graphHolder, selectionCallback) {
        var graphType = pattern.graphType;
        var q1 = pattern.questions[0];
        var q2 = pattern.questions[1];
        var q3 = pattern.questions[2]
        var newGraph = null;
        switch (graphType) {
            case "bar":
                newGraph = charting.d3BarChartForQuestion(graphHolder, q1, selectionCallback);
                break;
            case "table":
                newGraph = charting.d3ContingencyTable(graphHolder, q1, q2, null, selectionCallback);
                break;
            case "contingency-histogram":
                newGraph = charting.d3ContingencyTable(graphHolder, q1, q2, q3, selectionCallback);
                break;
            case "histogram":
                newGraph = charting.d3HistogramChartForQuestion(graphHolder, q1, null, null, selectionCallback);
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                newGraph = charting.multipleHistograms(graphHolder, q2, q1, selectionCallback);
                break;
            case "scatter":
                newGraph = charting.d3ScatterPlot(graphHolder, q1, q2, null, null, selectionCallback);
                break;        
            case "multiple scatter":
                newGraph = charting.multipleScatterPlot(graphHolder, q1, q2, q3, selectionCallback);
                break;
            case "data integrity":
                if (pattern.patternName === "Unanswered choice questions" || pattern.patternName === "Unanswered scale questions") {
                    newGraph = charting.d3BarChartForDataIntegrity(graphHolder, pattern.questions, pattern.patternName);
                    break;
                } else {
                    if (pattern.patternName === "Participant means" || pattern.patternName === "Participant standard deviations") {
                    graphHolder.excludeStoryTooltips = true; // no stories to link tooltips to in these cases
                    }
                newGraph = charting.d3HistogramChartForDataIntegrity(graphHolder, pattern.questions, pattern.patternName);
                break;
                }
            case "texts":
                newGraph = null;
                break;
           default:
                console.log("ERROR: Unexpected graph type");
                alert("ERROR: Unexpected graph type");
                break;
        }
        //console.log("newGraph", newGraph);
        return newGraph;
    }

    updateStoriesPane(stories) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
    }
    
    patternSelected(selectedPattern) {
        this.chooseGraph(selectedPattern);
        this.currentPattern = selectedPattern;
        
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        this.storyGrid.updateData();
    }

//------------------------------------------------------------------------------------------------------------------------------------------
// showing selected stories in current graph 
//------------------------------------------------------------------------------------------------------------------------------------------
    
    doThingsWithSelectedStories() {
        var actionElement = <HTMLTextAreaElement>document.getElementById("thingsYouCanDoPanel_actionRequested");
        var action = actionElement.value;
        switch (action) {
            case "Show selected stories in separate window for copying":
                this.showAllStoriesSelectedInGraph();
                break;
            case "Show random sample of 10 selected stories":
                this.sampleStoriesSelectedInGraph(10);
                break;
            case "Show random sample of 20 selected stories":
                this.sampleStoriesSelectedInGraph(20);
                break;
            case "Show random sample of 30 selected stories":
                this.sampleStoriesSelectedInGraph(30);
                break;
            case "Save the current selection (it will appear in the text box below)":
                this.saveGraphSelection();
                break;
            case "Restore a saved selection (from the text box below; position your cursor inside it first)":
                this.restoreGraphSelection();
                break;
            default:
                alert("Please choose an action from the list before you click the button.");
                break;
        }
    }

    nameForCurrentGraphSelection() {
        var result = "";

        if (!this.currentPattern) return result;
        result += this.currentPattern.patternName;

        if (!this.graphHolder) return result;
        const selection = this.graphHolder.currentSelectionExtentPercentages;
        if (!selection) return result;
        
        switch (this.currentPattern.graphType) {
            case "bar":
                result += ": " + selection.selectionCategories.join(", ");
                break;
            case "table":
                result += ": " + selection.selectionCategories.join(", ");
                break;
            case "contingency-histogram":
                result += ": " + selection.selectionCategories.join(", ");
                break;
            case "histogram":
                result += ": " + selection.selectionCategories.join(", ");
                break;
            case "multiple histogram":
                result += " [" + selection.subgraphChoice + "]: " + selection.selectionCategories.join(", ");
                break;
            case "scatter":
                result += ": " + selection.selectionCategories.join(", ");
                break;        
            case "multiple scatter":
                result += " [" + selection.subgraphChoice + "]: " + selection.selectionCategories.join(", ");
                break;
            default:
                alert("NO name for current graph selection");
        }
        return result;
    }

    showAllStoriesSelectedInGraph() {
        var stories = this.modelForStoryGrid.storiesSelectedInGraph;
        if (!stories.length) {
            alert("Please select some stories in the graph.");
            return;
        }
        stories.sort(function(a, b) {
            if (a.indexInStoryCollection() < b.indexInStoryCollection()) return -1;
            if (a.indexInStoryCollection() > b.indexInStoryCollection()) return 1;
            return 0;
        });
        var text;
        const selectionName = this.nameForCurrentGraphSelection();

        // story names first
        text = "Names of stories (" + stories.length + ") in graph selection - " + selectionName + "\n\n";
        for (var i = 0; i < stories.length; i++) {
            text += stories[i].indexInStoryCollection() + ". " + stories[i].model.storyName + "\n";
        }

        // then full story texts
        text += "\nStories (" + stories.length + ") in graph selection - " + selectionName + "\n";
        const header = "\n----------------------------------------------------------------------------------------------------\n";
        for (var i = 0; i < stories.length; i++) {
            text += "\n" + stories[i].indexInStoryCollection() + ". " + stories[i].model.storyName;
            if (this.numStoryCollectionsIncludedInReport > 1) text += "\nStory collection: " + stories[i].storyCollectionIdentifier();
            text += header + stories[i].model.storyText + "\n";
        }
        dialogSupport.openTextEditorDialog(text, "Selected stories", "Close", this.closeCopyStoriesDialogClicked.bind(this), false);
    }

    sample10StoriesSelectedInGraph() {
        this.sampleStoriesSelectedInGraph(10);
    }

    sample20StoriesSelectedInGraph() {
        this.sampleStoriesSelectedInGraph(20);
    }

    sample30StoriesSelectedInGraph() {
        this.sampleStoriesSelectedInGraph(30);
    }

    sampleStoriesSelectedInGraph(sampleSize) {
        var stories = this.modelForStoryGrid.storiesSelectedInGraph;
        if (!stories.length) {
            alert("Please select some stories to show.");
            return;
        }
        var sampledStories = [];
        if (stories.length <= sampleSize) {
            sampledStories = sampledStories.concat(stories);
        } else {   
            var sampledStoryIDs = [];   
            while (sampledStoryIDs.length < sampleSize) { 
                var randomIndex = Math.max(0, Math.min(stories.length - 1, Math.round(Math.random() * stories.length) - 1));
                if (sampledStoryIDs.indexOf(randomIndex) < 0) {
                    sampledStoryIDs.push(randomIndex);
                }
            }
            sampledStoryIDs.forEach(function(id) {
                sampledStories.push(stories[id]);
            });
        }
        sampledStories.sort(function(a, b) {
            if (a.indexInStoryCollection() < b.indexInStoryCollection()) return -1;
            if (a.indexInStoryCollection() > b.indexInStoryCollection()) return 1;
            return 0;
        });
        const selectionName = this.nameForCurrentGraphSelection();
        var text = "Story names (" + sampledStories.length + ") sampled from graph selection - " + selectionName + "\n\n";
        for (var i = 0; i < sampledStories.length; i++) {
            text += sampledStories[i].indexInStoryCollection() + ". " + sampledStories[i].model.storyName + "\n";
        }
        text += "\nStories (" + sampledStories.length + ") sampled from graph selection - " + selectionName + "\n";
        const header = "\n----------------------------------------------------------------------------------------------------\n";
        for (var i = 0; i < sampledStories.length; i++) {
            text += "\n" + sampledStories[i].indexInStoryCollection() + ". " + sampledStories[i].model.storyName;
            if (this.numStoryCollectionsIncludedInReport > 1) text += "\nStory collection: " + sampledStories[i].storyCollectionIdentifier();
            text += header + sampledStories[i].model.storyText + "\n";
        }
        dialogSupport.openTextEditorDialog(text, "Sampled stories", "Close", this.closeCopyStoriesDialogClicked.bind(this), false);        
    }

    closeCopyStoriesDialogClicked(text, hideDialogMethod) {     
        hideDialogMethod();
    }
    
//------------------------------------------------------------------------------------------------------------------------------------------
// saving and restoring graph selections
//------------------------------------------------------------------------------------------------------------------------------------------
    
saveGraphSelection() {
        if (!this.graphHolder.currentGraph) {
            // TODO: Translated
            alert("Please select a pattern first");
            return;
        }
        
        if (!this.graphHolder.currentSelectionExtentPercentages) {
            alert("Please make a selection in the graph first.");
            return;
        }
        
        if (this.scanForSelectionJSON()) {
            // TODO: Translate
            alert("This insertion would change a previously saved graph selection because your cursor is currently inside a curly-brackets reference.\nPlease click outside a reference.");
            return;
        }
        
        if (!this.currentPattern) return;
        
        // Find observation textarea and other needed data
        var textarea = <HTMLTextAreaElement>document.getElementById("thingsYouCanDoPanel_savedGraphSelections");
        var selection = this.graphHolder.currentSelectionExtentPercentages;
        var textToInsert = JSON.stringify(selection);
        
        // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
        var selectionStart = textarea.selectionStart;
        var selectionEnd = textarea.selectionEnd;
        var oldText = this.currentObservationSavedGraphSelections();
        var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
        this.currentObservationSavedGraphSelections(newText);
        
        // Set the new value explicitly here rather than waiting for a Mithril redraw so that we can then select it
        textarea.value = newText;
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart + textToInsert.length;
        textarea.focus();
    }

    scanForSelectionJSON(doFocus = false) {
        // TODO: Fix this for Mithril conversion
        var textarea = <HTMLTextAreaElement>document.getElementById("thingsYouCanDoPanel_savedGraphSelections");
        if (!this.currentPattern) return;
        var text = this.currentObservationSavedGraphSelections();
    
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
    
    restoreGraphSelection() {
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
            alert("To restore a graph selection, your cursor has to be inside the curly-brackets reference in the graph selections text box.\nClick inside the curly brackets, then try this again.");
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
            alert('The selected text was not a valid graph selection.\nTry clicking inside the curly brackets.');
            return;
        }
        
        var graph = this.graphHolder.currentGraph;
        if (_.isArray(graph)) {
            var optionText = selection.subgraphChoice;
            if (!optionText) {
                // TODO: Translate
                alert("No choice of sub-graph was specified in in the stored graph selection.");
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

//------------------------------------------------------------------------------------------------------------------------------------------
// observation and interpretations
//------------------------------------------------------------------------------------------------------------------------------------------
    
observationAccessor(pattern, field: string, newValue = undefined) {
    if (!this.catalysisReportObservationSetIdentifier) throw new Error("observationAccessor: this.catalysisReportObservationSetIdentifier is undefined");
    if (pattern.graphType == "data integrity") {
        var patternReference = this.patternReferenceForQuestions([pattern.patternName]);
    } else {
        var patternReference = this.patternReferenceForQuestions(pattern.questions);
    }
     
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

    if (newValue === undefined) {
        var result = this.project.tripleStore.queryLatestC(observationIdentifier, field);
        if (result === undefined || result === null) {
            result = "";
        }
        return result;
    } else {
        this.project.tripleStore.addTriple(observationIdentifier, field, newValue);
        return newValue;
    }
}

currentObservationHasTitleOrDescription() {
    if (!this.currentPattern) {
        return false;
    }
    return (this.observationAccessor(this.currentPattern, "observationTitle") !== "") || (this.observationAccessor(this.currentPattern, "observationDescription") !== "");
}

currentObservationDescription(newValue = undefined) {
    if (!this.currentPattern) {
        return "";
    }
    return this.observationAccessor(this.currentPattern, "observationDescription", newValue);
}

currentObservationTitle(newValue = undefined) {
    if (!this.currentPattern) {
        return "";
    }
    return this.observationAccessor(this.currentPattern, "observationTitle", newValue);
}

currentObservationStrength(newValue = undefined) {
    if (!this.currentPattern) {
        return "";
    }
    return this.observationAccessor(this.currentPattern, "observationStrength", newValue);
}

currentObservationSavedGraphSelections(newValue = undefined) {
    if (!this.currentPattern) {
        return "";
    }
    return this.observationAccessor(this.currentPattern, "observationSavedGraphSelections", newValue);
}

currentObservationInterpretations(newValue = undefined) {
    if (!this.currentPattern) {
        return "";
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

patternReferenceForQuestions(questions) {
    // TODO: Maybe should be object instead of array?
    var result = [];
    questions.forEach(function (question) {
        var typeOfObject = Object.prototype.toString.call(question);
        if (typeOfObject == "[object String]") { // no question list for data integrity graphs
            result.push(question);
        } else {
            result.push(question.id);
        }
    });
    return {setItem: result};
}

}

export = PatternExplorer;
