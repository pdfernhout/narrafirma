import charting = require("./charting");
import graphStyle = require("../graphStyle");
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
import canvg = require("canvgModule");
import jszip = require("jszip");
import saveAs = require("FileSaver");

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
        {id: "q1DisplayName", displayName: "Question 1", valueOptions: []},
        {id: "q2DisplayName", displayName: "Question 2", valueOptions: []},
        {id: "q3DisplayName", displayName: "Question 3", valueOptions: []},
        {id: "graphType", displayName: "Graph type", valueOptions: []},
        {id: "statsSummary", displayName: "Significance value", valueOptions: []},
        {id: "observation", displayName: "Observation(s)", valueOptions: []},
        {id: "strength", displayName: "Strength(s)", valueOptions: []},
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

function findOrCreateObservationIDForPatternAndIndex(project, catalysisReportObservationSetIdentifier, pattern, index, createIfNotFound) {
    let patternReference = PatternExplorer.patternReferenceForPatternAndIndex(pattern, index);
    if (!catalysisReportObservationSetIdentifier) throw new Error("findOrCreateObservationIDForPatternAndIndex: catalysisReportObservationSetIdentifier is undefined");
    let observationID = project.tripleStore.queryLatestC(catalysisReportObservationSetIdentifier, patternReference);
    if (!observationID && createIfNotFound) { 
        observationID = generateRandomUuid("Observation");
        project.tripleStore.addTriple(catalysisReportObservationSetIdentifier, patternReference, observationID);
        const copyOfPatternForPrinting = {id: pattern.id, graphType: pattern.graphType, patternName: pattern.patternName, questions: pattern.questions};
        project.tripleStore.addTriple(observationID, "pattern", copyOfPatternForPrinting);
    } 
    return observationID;
}

//------------------------------------------------------------------------------------------------------------------------------------------
// PatternExplorer
//------------------------------------------------------------------------------------------------------------------------------------------

class PatternExplorer {

    project: Project = null;
    catalysisReportIdentifier: string = null;
    catalysisReportObservationSetIdentifier: string = null;

    questions = [];
    questionsToInclude = null;
    
    patternsGridFieldSpecification: any = null;
    thingsYouCanDoPanelSpecification = null;
    thingsYouCanDoIfNoSelectionPanelSpecification = null;
    textAnswersPanelSpecification = null;
    observationsPanelSpecification = null;
    interpretationsPanelSpecification = null;
    
    modelForPatternsGrid = {patterns: []};
    patternsGrid: GridWithItemPanel;
    currentPattern = null;
    
    activeObservationTab = 0;
    observationAccessors: ObservationAccessor[] = [];

    graphHolder: GraphHolder;
    
    modelForStoryGrid = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: any = null;
    storyGrid: GridWithItemPanel = null;

    showInterpretationsInGrid = false;
    graphMultiChoiceQuestionsAgainstThemselves = false;
    hideStatsPanels = false;
    graphTypesToCreate = Project.default_graphTypesToCreate;
    numStoryCollectionsIncludedInReport = 0;

    progressMessage = "Calculating statistics";
    calculationsCanceled = false;
    
    //------------------------------------------------------------------------------------------------------------------------------------------
    // static functions - used from printing and csv import/export
    //------------------------------------------------------------------------------------------------------------------------------------------

    static patternReferenceForPatternAndIndex(pattern, index: number) {
        let questionReferences = [];
        if (pattern.graphType == "data integrity") {
            questionReferences = [pattern.patternName];
        } else {
            questionReferences = pattern.questions.map(function (question) {return question.id;});
        }
        if (index !== undefined && index !== null && index !== 0) questionReferences.push({observationIndex: index});
        return {setItem: questionReferences};
    }
    
    static getOrSetWhetherNoAnswerValuesShouldBeHiddenForPattern(project: Project, catalysisReportIdentifier: string, pattern, newValue = undefined) {
        const patternReference = JSON.stringify({"patternDisplayConfiguration": PatternExplorer.patternReferenceForPatternAndIndex(pattern, 0)});
        const configurationObject: PatternDisplayConfiguration = project.tripleStore.queryLatestC(catalysisReportIdentifier, patternReference) || {};
        if (newValue === undefined) {
            if (configurationObject.hideNoAnswerValues !== undefined) {
                return configurationObject.hideNoAnswerValues;
            } else {
                return project.tripleStore.queryLatestC(catalysisReportIdentifier, "hideNoAnswerValues_reportDefault") || false;
            }
        } else {
            configurationObject.hideNoAnswerValues = newValue;
            project.tripleStore.addTriple(catalysisReportIdentifier, patternReference, configurationObject);
            return configurationObject.hideNoAnswerValues;
        }
    }

    constructor(args) {
        this.project = Globals.project();

        const clientState = Globals.clientState();
        clientState.leavingPageCallback(() => {
            this.calculationsCanceled = true;
        });
        
        this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            minimumStoryCountRequiredForTest: Project.default_minimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: Project.default_minimumStoryCountRequiredForGraph,
            numHistogramBins: Project.default_numHistogramBins,
            numScatterDotOpacityLevels: Project.default_numScatterDotOpacityLevels,
            scatterDotSize: Project.default_scatterDotSize,
            correlationMapShape: Project.default_correlationMapShape,
            correlationLineChoice: Project.default_correlationLineChoice,
            customLabelLengthLimit: Project.default_customLabelLengthLimit,
            customGraphWidth: Project.default_customDisplayGraphWidth,
            hideNumbersOnContingencyGraphs: false,
            graphTypesToCreate: Project.default_graphTypesToCreate,
            patternDisplayConfiguration: {hideNoAnswerValues: false},
        };
        
        this.setUpEditingPanels(args);
        
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
        this.updateGraphForNewPattern(null);
    }

    setUpEditingPanels(args) {
        const storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(this.questions);
        const storyGridConfiguration = {
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
                    displayPrompt: "These are some <strong>things you can do</strong> based on the graph above and the selection you have made in it.",
                    displayType: "select",
                    displayWithoutQuestionDivs: true,
                    valueOptions: [
                        "Show statistical results",
                        "Show selected stories in separate window for copying", 
                        "Show random sample of 10 selected stories", 
                        "Show random sample of 20 selected stories", 
                        "Show random sample of 30 selected stories",
                        'Toggle display of "No answer" values',
                        "Save the current selection (it will appear in the text box below)",
                        "Restore a saved selection (from the text box below; position your cursor inside it first)",
                        "Save graph(s) as SVG file(s)",
                        "Save graph(s) as PNG file(s)"],
                },
                {
                    id: "thingsYouCanDoPanel_doThingsWithSelectedStories",
                    displayPrompt: "Do it",
                    displayType: "button",
                    displayPreventBreak: true,
                    displayConfiguration: this.doThingsWithSelectedStories.bind(this),
                }, 
            ]};

        this.thingsYouCanDoIfNoSelectionPanelSpecification = {
                "id": "thingsYouCanDoPanel",
                panelFields: [ 
                    {
                        id: "thingsYouCanDoPanel_actionRequested",
                        valuePath: "selectionActionRequested",
                        displayPrompt: "These are some <strong>things you can do</strong> based on the graph above.",
                        displayType: "select",
                        displayWithoutQuestionDivs: true,
                        valueOptions: [
                            "Show statistical results",
                            "Save graph(s) as SVG file(s)",
                            "Save graph(s) as PNG file(s)"],
                    },
                    {
                        id: "thingsYouCanDoPanel_doThingsWithSelectedStories",
                        displayPrompt: "Do it",
                        displayType: "button",
                        displayPreventBreak: true,
                        displayConfiguration: this.doThingsWithSelectedStories.bind(this),
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
        };

        this.observationsPanelSpecification = {
            "id": "observationPanel",
            panelFields: [  
                {
                    id: "observationPanel_description",
                    valuePath: "/clientState/observationAccessor/observationDescription",
                    displayName: "Observation description",
                    displayPrompt: "If this pattern is noteworthy, enter an <strong>observation</strong> about the pattern here. To enter another observation, click the plus button.",
                    displayType: "textarea"
                },
                {
                    id: "observationPanel_title",
                    valuePath: "/clientState/observationAccessor/observationTitle",
                    displayName: "Observation title",
                    displayPrompt: "Please give this observation a short <strong>name</strong>. This name will represent it during clustering and in the printed report.",
                    displayType: "text"
                },
                {
                    id: "observationPanel_strength",
                    valuePath: "/clientState/observationAccessor/observationStrength",
                    displayName: "Observation strength",
                    displayPrompt: "How <strong>strong</strong> is this pattern?",
                    displayType: "select",
                    valueOptions: ["1 (weak)", "2 (medium)", "3 (strong)"]
                },
                {
                    id: "observationPanel_linkingQuestion",
                    valuePath: "/clientState/observationAccessor/observationLinkingQuestion",
                    displayName: "Observation linking question",
                    displayPrompt: `You might want to enter a <strong>linking question</strong> that will connect this observation to its interpretations (e.g., "Why did people say ___?").`,
                    displayType: "text"
                },
                {
                    id: "observationPanel_extraPatterns",
                    valuePath: "/clientState/observationAccessor/observationExtraPatterns",
                    displayName: "Observation extra patterns",
                    displayPrompt: `To <strong>include additional patterns</strong>, describe each pattern on a separate line. 
                        Enter its question names exactly as you see them in the table above, in the same order, separated by two equals signs.
                        (For details, see the help system.)`,
                    displayType: "textarea"
                },
                {
                    id: "observationPanel_savedGraphSelections",
                    valuePath: "/clientState/observationAccessor/observationSavedGraphSelections",
                    displayName: "Graph selections",
                    displayPrompt: 'These are <strong>selections you have saved</strong> for this pattern.',
                    displayType: "text",
                },
            ]
        };

        this.interpretationsPanelSpecification = {
            "id": "interpretationsPanel",
            panelFields: [        
                {
                    id: "interpretationsPanel_interpretationsList",
                    valuePath: "/clientState/observationAccessor/observationInterpretations",
                    valueType: "array",
                    displayType: "grid",
                    displayConfiguration: "panel_addInterpretation",
                    displayName: "Interpretations",
                    displayPrompt: "Enter at least two <strong>competing interpretations</strong> for the observation here.",
                }
            ]
        };
    }
    
    static controller(args) {
        return new PatternExplorer(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    //------------------------------------------------------------------------------------------------------------------------------------------
    // redrawing
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    calculateView(args) {
        const panelBuilder: PanelBuilder = args.panelBuilder;
        const clientState = Globals.clientState();
        
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

        const buildObservationsAndInterpretationsPanels = () => {
            if (this.observationAccessors.length === 0) {
                return m("button", {onclick: this.addObservationTabClick.bind(this),}, m("span.button-text ", "Add an observation for this pattern"));
            }
            let tabs = [];
            for (let i = 0; i < this.observationAccessors.length; i++) {
                const tab = m("button", {
                    class: (i === this.activeObservationTab) ? "narrafirma-tab-button-selected" : "narrafirma-tab-button", 
                    onclick: this.switchToObservationTabClick.bind(this, i),
                    title: "Click to switch to another observation tab"
                }, "" + (i+1));
                tabs.push(tab);
            }
            tabs.push(m("button", {
                class: "narrafirma-tab-button", 
                onclick: this.addObservationTabClick.bind(this),
                title: "Click to add another observation to this pattern"
            }, "+"));
            tabs.push(m("button", {
                class: "narrafirma-tab-button", 
                onclick: this.deleteObservationTabClick.bind(this),
                title: "Click here to delete this observation (permanently)"
            }, "-"));
            let tabContents = [];
            if (this.activeObservationTab >= 0 && this.activeObservationTab < this.observationAccessors.length) {
                const activeAccessor = this.observationAccessors[this.activeObservationTab];
                clientState.observationAccessor(activeAccessor);
                tabContents.push([
                    panelBuilder.buildPanel(this.observationsPanelSpecification, {}),
                    activeAccessor.observationHasTitleOrDescription() ? panelBuilder.buildPanel(this.interpretationsPanelSpecification, {}) : m("div"),
                ]);
            } 
            return m(".narrafirma-tabs", m(".narrafirma-tabs-header", tabs), m(".narrafirma-tabs-body", tabContents),
            );
        }

        if (!this.catalysisReportIdentifier) {
            parts = [m("div.narrafirma-choose-catalysis-report", "Please select a catalysis report to work with.")];
        } else if (isMissingQuestionsToInclude(this.questionsToInclude)) {
            parts = [m("div.narrafirma-choose-questions-to-include", {style: "text-align: center; margin: 2em"}, "Nothing to see here! Please select some questions to include in the report (on the previous page).")];
        } else if (isMissingGraphTypesToCreate(this.graphTypesToCreate)) {
            parts = [m("div.narrafirma-choose-graph-types-to-include", {style: "text-align: center; margin: 2em"}, "Nothing to see here! Please select some graph types to include in the report (on the previous page).")];
        } else {
            const patternsAndStrengthsToDisplayAbovePatternsTable = this.patternsAndStrengthsToDisplayAbovePatternsTable();

            const cancelButton = m("button", {
                onclick: () => {
                    this.calculationsCanceled = true;
                    this.progressMessage = "";
                }
            }, "Cancel");
            const buildGridHeader = () => {
                return m("div.patterns-grid-header", 
                    patternsAndStrengthsToDisplayAbovePatternsTable, 
                    m("span#gridHeaderProgressMessage" + (this.progressMessage ? ".pleaseWaitStatisticsOverlay" : ""), this.progressMessage),
                    this.progressMessage ? cancelButton : [],
                );
            };

            let activeAccessor = null;
            if (this.observationAccessors.length > this.activeObservationTab)
            activeAccessor = this.observationAccessors[this.activeObservationTab];

            if (this.currentPattern && (this.currentPattern.graphType === "data integrity" || this.currentPattern.graphType === "correlation map")) {
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(),
                    m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                    panelBuilder.buildPanel(this.thingsYouCanDoIfNoSelectionPanelSpecification, activeAccessor || this),
                    buildObservationsAndInterpretationsPanels(),
                ];
            } else if (this.currentPattern && this.currentPattern.graphType === "texts") {
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(),
                    panelBuilder.buildPanel(this.textAnswersPanelSpecification, this),
                    buildObservationsAndInterpretationsPanels(),
                ];
            } else { 
                const numStories = this.modelForStoryGrid.storiesSelectedInGraph.length;
                const storyOrStoriesWord = (numStories > 1) ? "stories" : "story";
                var selectedStoriesText = "" + numStories + " " + storyOrStoriesWord + " in selection - " + this.nameForCurrentGraphSelection();
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(),
                    this.currentPattern ?
                        [
                            m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                            (this.modelForStoryGrid.storiesSelectedInGraph.length > 0) ? 
                                m("div", {"class": "narrafirma-pattern-browser-selected-stories-header"}, selectedStoriesText) : m("div"),
                            (this.modelForStoryGrid.storiesSelectedInGraph.length > 0) ? this.storyGrid.calculateView() : m("div"),
                            panelBuilder.buildPanel(this.thingsYouCanDoPanelSpecification, activeAccessor || this),
                            buildObservationsAndInterpretationsPanels(),
                        ] :
                        // TODO: Translate
                        m("div.narrafirma-choose-pattern", "Please select a pattern to view in the table above.")
                ];
            }
        }
        return m("div.narrafirma-patterns-grid", parts);
    }

    patternsAndStrengthsToDisplayAbovePatternsTable() {
        if (!this) return "";
        let result = "";
        let strengthCounts = {"3 (strong)": 0, "2 (medium)": 0, "1 (weak)": 0};
        let numObservationsWithoutStrengths = 0;
        let numInterpretations = 0;

        let observationIDs = this.project.tripleStore.getListForSetIdentifier(this.catalysisReportObservationSetIdentifier);
        let nonBlankObservations = [];
        observationIDs.forEach(id => {
            let observation = this.project.tripleStore.makeObject(id, true);
            if (observation && observation.observationTitle || observation.observationDescription) nonBlankObservations.push(observation);
        });

        for (let i = 0; i < nonBlankObservations.length ; i++) {
            if (nonBlankObservations[i].observationStrength) {
                strengthCounts[nonBlankObservations[i].observationStrength] += 1;
            } else {
                numObservationsWithoutStrengths += 1;
            }
            const interpretationIDs = this.project.tripleStore.getListForSetIdentifier(nonBlankObservations[i].observationInterpretations); 
            numInterpretations += interpretationIDs.length;
        }

        result += "" + this.modelForPatternsGrid.patterns.length + (this.modelForPatternsGrid.patterns.length !== 1 ? " patterns" : " pattern");
        if (Object.keys(strengthCounts).length) {
            result += ", " + nonBlankObservations.length + (nonBlankObservations.length !== 1 ? " observations" : " observation");
            result += " (by strength, ";
            var keyCount = 0;
            Object.keys(strengthCounts).forEach(function(key) {
                result += key.slice(0,1) + ": " + strengthCounts[key];
                if (keyCount < 2) result += "; ";
                keyCount++;
            });
            result += "; none: " + numObservationsWithoutStrengths + "), ";
        }
        result += numInterpretations + (numInterpretations !== 1 ? " interpretations" : " interpretation");
        return result;
    }

    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // updating data
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    currentCatalysisReportChanged(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) return;

        // update options kept in this object
        this.graphTypesToCreate = this.project.tripleStore.queryLatestC(catalysisReportIdentifier, "graphTypesToCreate") || Project.default_graphTypesToCreate;
        this.showInterpretationsInGrid = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "showInterpretationsInGrid"); 
        this.graphMultiChoiceQuestionsAgainstThemselves = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "graphMultiChoiceQuestionsAgainstThemselves"); 
        this.hideStatsPanels = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "hideStatsPanelsOnExplorePatternsPage"); 
        this.catalysisReportObservationSetIdentifier = this.getObservationSetIdentifier(catalysisReportIdentifier);

        // update options kept in graph holder
        this.graphHolder.minimumStoryCountRequiredForTest = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "minimumSubsetSize") || Project.default_minimumStoryCountRequiredForTest; 
        this.graphHolder.minimumStoryCountRequiredForGraph = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "minimumStoryCountRequiredForGraph") || Project.default_minimumStoryCountRequiredForGraph; 
        this.graphHolder.numHistogramBins = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "numHistogramBins") || Project.default_numHistogramBins; 
        this.graphHolder.numScatterDotOpacityLevels = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "numScatterDotOpacityLevels") || Project.default_numScatterDotOpacityLevels; 
        this.graphHolder.scatterDotSize = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "scatterDotSize") || Project.default_scatterDotSize; 
        this.graphHolder.correlationMapShape = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationMapShape") || Project.default_correlationMapShape; 
        
        this.graphHolder.correlationLineChoice = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationLineChoice") || Project.default_correlationLineChoice; 
        this.graphHolder.customLabelLengthLimit = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customLabelLengthLimit") || Project.default_customLabelLengthLimit; 
        this.graphHolder.customGraphWidth = parseInt(this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customDisplayGraphWidth")) || Project.default_customDisplayGraphWidth; 
        this.graphHolder.hideNumbersOnContingencyGraphs = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "hideNumbersOnContingencyGraphs"); 
        this.updateStyleSheetForCustomGraphCSS();

        // get stories 
        this.graphHolder.allStories = this.project.storiesForCatalysisReport(catalysisReportIdentifier);
        this.numStoryCollectionsIncludedInReport = this.project.numStoryCollectionsInCatalysisReport(catalysisReportIdentifier);

        // gather questions for patterns table
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

        // adjust patterns grid for showing or hiding interpretations
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
        this.updateGraphForNewPattern(null);     
    }

    updateStyleSheetForCustomGraphCSS() {
        // save css in graphHolder to use for saving files to SVG/PNG
        this.graphHolder.customGraphCSS = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "catalysisReport_customGraphCSS");
        
        const styleSheetName = "customGraphStyleSheet";                
        const oldStyleSheet = document.getElementById(styleSheetName);
        if (oldStyleSheet && oldStyleSheet.parentNode) oldStyleSheet.parentNode.removeChild(oldStyleSheet);
        
        if (this.graphHolder.customGraphCSS) {
            const newStyleSheet = document.createElement("style");
            newStyleSheet.setAttribute("id", styleSheetName);
            newStyleSheet.innerHTML = this.graphHolder.customGraphCSS;
            const script = document.querySelector("script");
            script.parentNode.insertBefore(newStyleSheet, script);
        }
    }

    // TODO: Similar to what is in add_graphBrowser
    getCurrentCatalysisReportIdentifier(args) {
        const catalysisReportShortName = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        if (!catalysisReportShortName) return null;
        return this.project.findCatalysisReport(catalysisReportShortName);
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // patterns table
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    buildPatternList() {
        if (!this.questionsToInclude) return [];
        const project = this.project;

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

        var result = this.buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, true);

        const self = this;

        const progressUpdater = {
            progressMessage: "Calculating statistics",
            redraw: function() {
                self.progressMessage = progressUpdater.progressMessage;
                // update progress message without using Mithril to avoid slowdown on this large page
                const progressMessageSpan = document.getElementById("gridHeaderProgressMessage")
                if (progressMessageSpan) {
                    progressMessageSpan.innerHTML = this.progressMessage;
                }
            }
        }
        progressUpdater.redraw();

        var patternIndex = 0;
        var howOftenToUpdateProgressMessage = 20; 
        var stories = this.graphHolder.allStories;
        var minimumStoryCountRequiredForTest = this.graphHolder.minimumStoryCountRequiredForTest;

        if (!this.calculationsCanceled) {
            setTimeout(function() { calculateStatsForNextPattern(); }, 1);
        }

        const calculateStatsForNextPattern = () => {
            if (patternIndex >= result.length) {
                progressUpdater.progressMessage = "";
                progressUpdater.redraw();
                m.redraw();
            } else {
                const hideNoAnswerValues = PatternExplorer.getOrSetWhetherNoAnswerValuesShouldBeHiddenForPattern(project, this.catalysisReportIdentifier, result[patternIndex]);
                calculateStatistics.calculateStatisticsForPattern(result[patternIndex], stories, 
                    minimumStoryCountRequiredForTest, "No answer", !hideNoAnswerValues, 
                    progressUpdater, patternIndex, result.length, howOftenToUpdateProgressMessage);
                patternIndex += 1;
                if (!self.calculationsCanceled) {
                    setTimeout(function() { calculateStatsForNextPattern(); }, 1);
                }
            }
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

        // all scale questions, all choice questions
        if (this.graphTypesToCreate["correlation maps"]) {
            result.push(this.makePattern(nextID(), "correlation map", scaleQuestions, "Correlation map"));
            nominalQuestions.forEach((nominalQuestion) => {
                if (build) {
                    let aName = "Correlation map for " + nominalQuestion.displayName;
                    let questionList = [];
                    questionList.push(nominalQuestion); // choice question must be first in the list
                    questionList = questionList.concat(scaleQuestions);
                    result.push(this.makePattern(nextID(), "correlation map", questionList, aName));
                } else {
                    graphCount++;
                }
            });
        }

        if (build) {
            return result;
        } else {
            return [graphCount]; // so there is not a different return type
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // selected pattern 
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    makePattern(id, graphType, questions, patternNameIfSpecialType) {
        var pattern; 
        if (graphType == "data integrity") {
            pattern = {id: id, graphType: graphType, patternName: patternNameIfSpecialType, 
                questions: questions, q1DisplayName: "", q2DisplayName: "", q3DisplayName: ""};    
        } else if (graphType == "correlation map") {
            pattern = {id: id, graphType: graphType, patternName: patternNameIfSpecialType, 
                questions: questions, q1DisplayName: "", q2DisplayName: "", q3DisplayName: ""};  
        } else if (questions.length === 1) {
            pattern = {id: id, graphType: graphType, patternName: nameForQuestion(questions[0]), 
                questions: questions, q1DisplayName: questions[0].displayName, q2DisplayName: "", q3DisplayName: ""};    
        } else if (questions.length === 2) {
            pattern = {id: id, graphType: graphType, patternName: nameForQuestion(questions[0]) + " x " + nameForQuestion(questions[1]), 
                questions: questions, q1DisplayName: questions[0].displayName, q2DisplayName: questions[1].displayName, q3DisplayName: ""};  
        } else if (questions.length === 3) {
            pattern = {id: id, graphType: graphType, patternName: nameForQuestion(questions[0]) + " x " + nameForQuestion(questions[1]) + " + " + nameForQuestion(questions[2]), 
                questions: questions, q1DisplayName: questions[0].displayName, q2DisplayName: questions[1].displayName, q3DisplayName: questions[2].displayName};  
        } else {
            console.log("makePattern: Unexpected number of questions", questions);
            throw new Error("makePattern: Unexpected number of questions: " + questions.length);
        }

        pattern.observationIDs = [];
        let index = 0;
        let observationID = "";
        while (observationID !== undefined) {
            observationID = findOrCreateObservationIDForPatternAndIndex(this.project, this.catalysisReportObservationSetIdentifier, pattern, index, false);
            if (observationID) pattern.observationIDs.push(observationID);
            index++;
        }

        var observationTitleOrDescriptionAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationTitle") || this.getCombinedObservationsInfoForPattern(pattern, "observationDescription");
        };
        var strengthAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationStrength") || "";
        };
        var interpretationsAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationInterpretations") || "";
        };
       
        pattern.observation = observationTitleOrDescriptionAccessor;  // circular reference
        pattern.strength = strengthAccessor;
        pattern.interpretations = interpretationsAccessor;
        return pattern;
    }

    patternSelected(selectedPattern) {
        this.activeObservationTab = 0;
        this.updateGraphForNewPattern(selectedPattern);
        this.currentPattern = selectedPattern;
        this.updateObservationPanelForSelectedPattern();
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        this.storyGrid.updateData();
    }

    updateStoriesPane(stories) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
    }
    
    updateObservationPanelForSelectedPattern() {
        if (!this.currentPattern) return;
        this.observationAccessors = [];
        this.currentPattern.observationIDs.forEach(id => {
            const newAccessor = new ObservationAccessor(this.project, id);
            this.observationAccessors.push(newAccessor);
        });
    }

    getCombinedObservationsInfoForPattern(pattern, field) {
        let resultTexts = [];
        if (pattern && pattern.observationIDs && pattern.observationIDs.length > 0) {
            pattern.observationIDs.forEach(id => {
                if (field === "observationInterpretations") {
                    const observation = this.project.tripleStore.makeObject(id, true);
                    const interpretationIDs = this.project.tripleStore.getListForSetIdentifier(observation.observationInterpretations); 
                    let interpretationTexts = [];
                    interpretationIDs.forEach( id => {
                        const interpretation = this.project.tripleStore.makeObject(id, true);
                        if (interpretation) interpretationTexts.push(interpretation.interpretation_name || interpretation.interpretation_text);
                    });
                    if (interpretationTexts.length) resultTexts.push(interpretationTexts.join(" / "));
                } else {
                    const value = this.project.tripleStore.queryLatestC(id, field);
                    if (value) resultTexts.push(value);
                }
            });
        }
        return resultTexts.join(" // ");  
    }

    updateGraphForNewPattern(pattern) {
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

        const oldHideNoAnswerValuesChoice = this.graphHolder.patternDisplayConfiguration.hideNoAnswerValues;
        const newHideNoAnswerValuesChoice = PatternExplorer.getOrSetWhetherNoAnswerValuesShouldBeHiddenForPattern(this.project, this.catalysisReportIdentifier, pattern);
        this.graphHolder.patternDisplayConfiguration.hideNoAnswerValues = newHideNoAnswerValuesChoice; 
        if (oldHideNoAnswerValuesChoice !== newHideNoAnswerValuesChoice) {
            calculateStatistics.calculateStatisticsForPattern(pattern, this.graphHolder.allStories, 
                this.graphHolder.minimumStoryCountRequiredForTest, "No answer", !newHideNoAnswerValuesChoice, null, 0, 0, 0);
        }

        this.graphHolder.statisticalInfo = "";
        this.graphHolder.currentGraph = PatternExplorer.makeGraph(pattern, this.graphHolder, this.updateStoriesPane.bind(this), this.hideStatsPanels);
        this.graphHolder.currentSelectionExtentPercentages = null;
        // TODO: Is this obsolete? this.graphHolder.currentSelectionSubgraph = null;
    }

    static makeGraph(pattern, graphHolder, selectionCallback, hideStatsPanel = false) {
        var graphType = pattern.graphType;
        var q1 = pattern.questions[0];
        var q2 = pattern.questions[1];
        var q3 = pattern.questions[2]
        var newGraph = null;
        switch (graphType) {
            case "bar":
                newGraph = charting.d3BarChartForQuestion(graphHolder, q1, selectionCallback, hideStatsPanel);
                break;
            case "table":
                newGraph = charting.d3ContingencyTable(graphHolder, q1, q2, null, selectionCallback, hideStatsPanel);
                break;
            case "contingency-histogram":
                newGraph = charting.d3ContingencyTable(graphHolder, q1, q2, q3, selectionCallback, hideStatsPanel);
                break;
            case "histogram":
                newGraph = charting.d3HistogramChartForQuestion(graphHolder, q1, null, null, selectionCallback, hideStatsPanel);
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                newGraph = charting.multipleHistograms(graphHolder, q2, q1, selectionCallback, hideStatsPanel);
                break;
            case "scatter":
                newGraph = charting.d3ScatterPlot(graphHolder, q1, q2, null, null, selectionCallback, hideStatsPanel);
                break;        
            case "multiple scatter":
                newGraph = charting.multipleScatterPlot(graphHolder, q1, q2, q3, selectionCallback, hideStatsPanel);
                break;
            case "correlation map":
                newGraph = charting.d3CorrelationMapOrMaps(graphHolder, pattern.questions, hideStatsPanel);
                break;
            case "data integrity":
                if (pattern.patternName === "Unanswered choice questions" || pattern.patternName === "Unanswered scale questions") {
                    newGraph = charting.d3BarChartToShowUnansweredChoiceQuestions(graphHolder, pattern.questions, pattern.patternName);
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
    
    //------------------------------------------------------------------------------------------------------------------------------------------
    // showing/doing things with selected stories in current graph (or just whole graph)
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    doThingsWithSelectedStories() {
        var actionElement = <HTMLTextAreaElement>document.getElementById("thingsYouCanDoPanel_actionRequested");
        var action = actionElement.value;
        switch (action) {
            case "Show statistical results":
                this.showStatisticalResultsForGraph();
                break;
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
            case 'Toggle display of "No answer" values':
                this.toggleNoAnswerDisplayForPattern();
                break;
            case "Save the current selection (it will appear in the text box below)":
                this.saveGraphSelection();
                break;
            case "Restore a saved selection (from the text box below; position your cursor inside it first)":
                this.restoreGraphSelection();
                break;
            case "Save graph(s) as SVG file(s)":
                this.saveGraphAsFile("SVG");
                break;
            case "Save graph(s) as PNG file(s)":
                this.saveGraphAsFile("PNG");
                break;
            default:
                alert("Please choose an action from the list before you click the button.");
                break;
        }
    }
    
    toggleNoAnswerDisplayForPattern() {
        if (!this.currentPattern) return; 
        const hideNoAnswerValues = PatternExplorer.getOrSetWhetherNoAnswerValuesShouldBeHiddenForPattern(this.project, this.catalysisReportIdentifier, this.currentPattern);
        const newValue = !hideNoAnswerValues;
        PatternExplorer.getOrSetWhetherNoAnswerValuesShouldBeHiddenForPattern(this.project, this.catalysisReportIdentifier, this.currentPattern, newValue);
        this.updateGraphForNewPattern(this.currentPattern);
    }

    saveGraphAsFile(fileTypeToSave) {
        if (!this.graphHolder || !this.graphHolder.graphResultsPane) return;

        const svgNodes = this.graphHolder.graphResultsPane.querySelectorAll("svg"); 
        const titleNode = this.graphHolder.graphResultsPane.querySelector(".narrafirma-graph-title");

        if (svgNodes.length == 0 || !titleNode) return;

        const patternTitle = titleNode.innerHTML;

        if (svgNodes.length == 1) {

            if (fileTypeToSave === "SVG") {
                
                const svgFileText = graphStyle.prepareSVGToSaveToFile(svgNodes[0], this.graphHolder.customGraphCSS);
                const svgFileBlob = new Blob([svgFileText], {type: "text/svg+xml;charset=utf-8"});
                saveAs(svgFileBlob, patternTitle + ".svg", true); // true is to turn off 3-byte BOM (byte order mark) in UTF-8 encoding

            } else if (fileTypeToSave === "PNG") {

                const canvas = graphStyle.preparePNGToSaveToFile(svgNodes[0], this.graphHolder.customGraphCSS);
                canvas.toBlob(function(blob) {
                    saveAs(blob, patternTitle + ".png");
                })
            }

        } else {

            const zipFile = new jszip();

            for (var i = 0; i < svgNodes.length; i++) {

                let graphTitle = this.graphHolder.currentGraph[i].subgraphChoice;
                graphTitle = graphTitle.replace("/", " "); // jszip interprets a forward slash as a folder designation 

                if (fileTypeToSave === "SVG") {

                    const svgFileText = graphStyle.prepareSVGToSaveToFile(svgNodes[i], this.graphHolder.customGraphCSS);
                    zipFile.file(patternTitle + " " + graphTitle + ".svg", svgFileText);

                } else if (fileTypeToSave === "PNG") {

                    // when using canvas.toBlob either the ZIP file or the PNG files come out corrupted
                    // found this method to fix it online and it works
                    const canvas = graphStyle.preparePNGToSaveToFile(svgNodes[i], this.graphHolder.customGraphCSS);
                    const dataURI = canvas.toDataURL("image/png");
                    const imageData = graphStyle.dataURItoBlob(dataURI);
                    zipFile.file(patternTitle + " " + graphTitle + ".png", imageData, {binary: true});

                }
            }
            zipFile.generateAsync({type: "blob", platform: "UNIX", compression: "DEFLATE"})
                .then(function (blob) {
                    saveAs(blob, patternTitle + " " + fileTypeToSave + ".zip");
            });
        }
    }

    showStatisticalResultsForGraph() {
        if (!this.currentPattern) {
            alert("Please choose a graph.");
            return;
        }
        if (!this.graphHolder.statisticalInfo) {
            alert("No statistical information is available for the current graph.");
            return;
        }
        var titleText = "Statistics for pattern: " +  this.currentPattern.patternName;
        var text = titleText + (this.graphHolder.statisticalInfo.indexOf("\n\n") !== 0 ? "\n\n" : "") + this.graphHolder.statisticalInfo;
        dialogSupport.openTextEditorDialog(text, titleText, "Close", this.closeCopyStoriesDialogClicked.bind(this), false);
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
        this.showStoriesInSeparateWindow(stories, "in graph selection", "Selected stories");
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

        this.showStoriesInSeparateWindow(sampledStories, "sampled from graph selection", "Sampled stories");
    }

    showStoriesInSeparateWindow(stories, sayAboutSelection, windowTitle) {
        var i;
        var text;
        const selectionName = this.nameForCurrentGraphSelection();

        var questionShortNames = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionShortNamesToShowForSelectedStories");
        if (questionShortNames === undefined) {
            questionShortNames = [];
        } else {
            if (typeof questionShortNames === "string") {
                questionShortNames = questionShortNames.split("\n"); 
            }
        } 

        // have to add the right prefix to connect to fields in stories 
        // this assumes that question short names will be unique across all questions - though we do say that in the interface, so...
        var storyQuestions = this.project.storyQuestionsForCatalysisReport(this.catalysisReportIdentifier); 
        var participantQuestions = this.project.participantQuestionsForCatalysisReport(this.catalysisReportIdentifier);
        var annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        
        var questionIDsToShowForSelectedStories = [];
        questionShortNames.forEach(function(shortName) {
            for (i = 0; i < storyQuestions.length; i++) {
                if (storyQuestions[i].id === "S_" + shortName) {
                    questionIDsToShowForSelectedStories.push("S_" + shortName);
                    break;
                }
            }
            for (i = 0; i < participantQuestions.length; i++) {
                if (participantQuestions[i].id === "P_" + shortName) {
                    questionIDsToShowForSelectedStories.push("P_" + shortName);
                    break;
                }
            }
            for (i = 0; i < annotationQuestions.length; i++) {
                if (annotationQuestions[i].id === "A_" + shortName) {
                    questionIDsToShowForSelectedStories.push("A_" + shortName);
                    break;
                }
            }
        });

        function textWithAnswersToSelectedQuestions(story) {
            var questionAnswersToShow = [];
            questionIDsToShowForSelectedStories.forEach(function(fieldName) {
                var answer = story.fieldValue(fieldName);
                if (answer) {
                    if (typeof answer === "string") {
                        questionAnswersToShow.push(answer);
                    } else if (typeof answer === "number") {
                        questionAnswersToShow.push(answer.toString());
                    } else if (typeof answer === "object") { 
                        Object.keys(answer).forEach(answerPart => { if (answer[answerPart]) questionAnswersToShow.push(answerPart) });
                    }
                }
            });
            if (questionAnswersToShow.length) {
                return " (" + questionAnswersToShow.join(", ") + ")";
            }
            return "";
        }

        // story names first
        text = "Names of stories (" + stories.length + ") " + sayAboutSelection + " - " + selectionName + "\n\n";
        for (i = 0; i < stories.length; i++) {
            text += stories[i].indexInStoryCollection() + ". " + stories[i].model.storyName + textWithAnswersToSelectedQuestions(stories[i]) + "\n";
        }

        // then full story texts
        text += "\nStories (" + stories.length + ") " + sayAboutSelection + " - " + selectionName + "\n";
        const header = "\n----------------------------------------------------------------------------------------------------\n";
        for (i = 0; i < stories.length; i++) {
            text += "\n" + stories[i].indexInStoryCollection() + ". " + stories[i].model.storyName + textWithAnswersToSelectedQuestions(stories[i]);
            if (this.numStoryCollectionsIncludedInReport > 1) text += "\nStory collection: " + stories[i].storyCollectionIdentifier();
            text += header + stories[i].model.storyText + "\n";
        }

        dialogSupport.openTextEditorDialog(text, windowTitle, "Close", this.closeCopyStoriesDialogClicked.bind(this), false);
    }

    closeCopyStoriesDialogClicked(text, hideDialogMethod) {     
        hideDialogMethod();
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

            // cfk add case for network graph
            default:
                alert("NO name for current graph selection");
        }
        return result;
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // saving and restoring graph selections
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    saveGraphSelection() {
        if (this.activeObservationTab === undefined || this.activeObservationTab < 0 || !this.observationAccessors || this.activeObservationTab >= this.observationAccessors.length) {
            alert("Please create an observation in which to save your graph selection.");
            return;
        }

        const activeAccessor = this.observationAccessors[this.activeObservationTab];
        
        if (!this.graphHolder.currentGraph) {
            // TODO: Translated
            alert("Please select a pattern first.");
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
        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_savedGraphSelections");
        var selection = this.graphHolder.currentSelectionExtentPercentages;
        var textToInsert = JSON.stringify(selection);
        
        // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
        var selectionStart = textarea.selectionStart;
        var selectionEnd = textarea.selectionEnd;
        var oldText = activeAccessor.observationSavedGraphSelections();
        var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
        activeAccessor.observationSavedGraphSelections(newText);
        
        // Set the new value explicitly here rather than waiting for a Mithril redraw so that we can then select it
        textarea.value = newText;
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionStart + textToInsert.length;
        textarea.focus();
        }

    scanForSelectionJSON(doFocus = false) {
        if (this.activeObservationTab === undefined || this.activeObservationTab < 0 || !this.observationAccessors || this.activeObservationTab >= this.observationAccessors.length) return;
        const activeAccessor = this.observationAccessors[this.activeObservationTab];

        var textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_savedGraphSelections");
        if (!this.currentPattern) return;
        var text = activeAccessor.observationSavedGraphSelections();

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
            alert("Please select a pattern first.");
            return;
        }
        
        // TODO: Need better approach to finding brush extent text and safely parsing it
    
        // Find observation textarea and other needed data
        // var selectedText = oldText.substring(selectionStart, selectionEnd);
        var selectedText = this.scanForSelectionJSON(true);
        if (!selectedText) {
            // TODO: Translate
            alert("To restore a graph selection, your cursor has to be inside the curly-brackets reference in a graph selections text box (which is part of an observation).\nClick inside the curly brackets, then try this again.");
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
    // observations and interpretations
    //------------------------------------------------------------------------------------------------------------------------------------------

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

    switchToObservationTabClick(tabIndex) {
        if (tabIndex !== undefined) {
            this.activeObservationTab = tabIndex;
        }
    }

    addObservationTabClick() {
        const newIndex = this.currentPattern.observationIDs.length || 0;
        let newObservationID = findOrCreateObservationIDForPatternAndIndex(this.project, this.catalysisReportObservationSetIdentifier, this.currentPattern, newIndex, true);
        this.currentPattern.observationIDs.push(newObservationID);
        this.activeObservationTab = newIndex;
        this.updateObservationPanelForSelectedPattern();
    }

    deleteObservationTabClick() {
        if (this.currentPattern && this.currentPattern.observationIDs && this.currentPattern.observationIDs[this.activeObservationTab]) {
            const observationIDToRemove = this.currentPattern.observationIDs[this.activeObservationTab];
            const observationToRemove = this.project.tripleStore.makeObject(observationIDToRemove, true);
            const interpretationIDsToRemove = this.project.tripleStore.getListForSetIdentifier(observationToRemove.observationInterpretations);
            if (observationIDToRemove) {
                let message = 'Are you sure you want to delete the observation \n\n    ' + (observationToRemove.observationTitle || observationToRemove.observationDescription || "Untitled");
                if (interpretationIDsToRemove && interpretationIDsToRemove.length > 0) {
                    message += '\n\nand the ' + interpretationIDsToRemove.length;
                    message += (interpretationIDsToRemove.length !== 1) ? " interpretations" : " interpretation";
                    message += ' connected to it? You cannot undo this action.';
                } else {
                    message += "?\n\nYou cannot undo this action.";
                }
                if (confirm(message)) {
                    
                    // first, move down the saved index numbers of all observations ABOVE this one in the list for this pattern
                    // this has to be done because the index number is how the observation is looked up
                    // and if you didn't move everybody down to fill the gap, you would end up with (a) missing observations for indexes and (b) observations that are ignored
                    let indexToMoveDown = this.activeObservationTab + 1;
                    while (indexToMoveDown < this.currentPattern.observationIDs.length) {
                        const patternReference = PatternExplorer.patternReferenceForPatternAndIndex(this.currentPattern, indexToMoveDown - 1);
                        this.project.tripleStore.addTriple(this.catalysisReportObservationSetIdentifier, patternReference, this.currentPattern.observationIDs[indexToMoveDown]);
                        indexToMoveDown++;
                    }

                    // now that everything has been moved down, remove the LAST index from the dataset by setting to null
                    const patternReference = PatternExplorer.patternReferenceForPatternAndIndex(this.currentPattern, this.currentPattern.observationIDs.length-1);
                    this.project.tripleStore.addTriple(this.catalysisReportObservationSetIdentifier, patternReference, null);
                    
                    // now remove the selected observation ID from the list for the current pattern
                    this.currentPattern.observationIDs.splice(this.activeObservationTab, 1);

                    // check to make sure the current tab is still within the list length
                    this.activeObservationTab = Math.min(this.currentPattern.observationIDs.length-1, this.activeObservationTab);

                    // finally recreate the accessor objects
                    this.updateObservationPanelForSelectedPattern();
                }
            }
        }
    }

} // end of PatternExplorer

class ObservationAccessor {    

    constructor(
        public project: Project,
        public observationID: string,
    ) {
    }

    getOrSetField(field: string, newValue = undefined) {
        if (newValue === undefined) {
            var result = this.project.tripleStore.queryLatestC(this.observationID, field);
            if (result === undefined || result === null) {
                result = "";
            }
            return result;
        } else {
            this.project.tripleStore.addTriple(this.observationID, field, newValue);
            return newValue;
        }
    }

    observationHasTitleOrDescription() {
        return (this.getOrSetField("observationTitle") !== "") || (this.getOrSetField("observationDescription") !== "");
    }

    observationDescription(newValue = undefined) {
        return this.getOrSetField("observationDescription", newValue);
    }

    observationTitle(newValue = undefined) {
        return this.getOrSetField("observationTitle", newValue);
    }

    observationStrength(newValue = undefined) {
        return this.getOrSetField("observationStrength", newValue);
    }

    observationLinkingQuestion(newValue = undefined) {
        return this.getOrSetField("observationLinkingQuestion", newValue);
    }

    observationExtraPatterns(newValue = undefined) {
        return this.getOrSetField("observationExtraPatterns", newValue);
    }

    observationSavedGraphSelections(newValue = undefined) {
        return this.getOrSetField("observationSavedGraphSelections", newValue);
    }

    observationInterpretations(newValue = undefined) {
        return this.getOrSetField("observationInterpretations", newValue);
    }
}

export = PatternExplorer;
