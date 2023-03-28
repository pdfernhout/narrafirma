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
import { GraphHolder } from "../GraphHolder";
import { Story } from "../surveyCollection";
import csvImportExport = require("../csvImportExport");

"use strict";

//------------------------------------------------------------------------------------------------------------------------------------------
// support types and functions
//------------------------------------------------------------------------------------------------------------------------------------------

// Question types that have choice (not scale) data associated with them for filters and graphs
const nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

const patternsPanelSpecification = {
    id: "patternsPanel",
    modelClass: "Pattern",
    panelFields: [
        {id: "id", displayName: "Index", valueOptions: []},
        {id: "patternName", displayName: "Name", valueOptions: []},
        {id: "remarkable", displayName: "Remarkable?", valueOptions: []},
        {id: "note", displayName: "Notes", valueOptions: []},
        {id: "q1DisplayName", displayName: "Q1", valueOptions: []},
        {id: "q2DisplayName", displayName: "Q2", valueOptions: []},
        {id: "q3DisplayName", displayName: "Q3", valueOptions: []},
        {id: "graphType", displayName: "Type", valueOptions: []},
        {id: "statsSummary", displayName: "Significance", valueOptions: []},
        {id: "observation", displayName: "Observations", valueOptions: []},
        {id: "strength", displayName: "Strengths", valueOptions: []},
    ]
};

const columnIDsToDisplayNamesMap = {
    "patternName": "Name",
    "remarkable": "Remarkable?",
    "note": "Notes",
    "q1DisplayName": "Q1",
    "q2DisplayName": "Q2",
    "q3DisplayName": "Q3",
    "graphType": "Type",
    "statsSummary": "Significance",
    "observation": "Observations",
    "strength": "Strengths",
    "interpretations": "Interpretations",
};

const columnIDsToShowIfNoOptionsSaved = {
    "patternName": "Name",
    "remarkable": "Remarkable?",
    "graphType": "Type",
    "statsSummary": "Significance",
    "observation": "Observations",
    "strength": "Strengths",
    "interpretations": "Interpretations",
};

function nameForQuestion(question) {
    if (question.displayName) return question.displayName;
    if (question.displayPrompt) return question.displayPrompt;
    return question.id;
}

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function buildStoryDisplayPanel(panelBuilder: PanelBuilder, model) {
    const storyCardDiv = storyCardDisplay.generateStoryCardContent(model, undefined, {
        location: "storyBrowser", 
        storyTextAtTop: true, 
        includeWriteInAnswers: true,
        blankLineAfterStory: false
    });
    return storyCardDiv;
}

function makeItemPanelSpecificationForQuestions(questions) {
    const storyItemPanelSpecification = {
         id: "patternBrowserQuestions",
         modelClass: "Story",
         panelFields: questions,
         buildPanel: buildStoryDisplayPanel
    };
    storyItemPanelSpecification.panelFields.push({id: "indexInStoryCollection", displayName: "Index", valueOptions: []},);
    return storyItemPanelSpecification;
}

function decodeCurlyBraces(optionText) {
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

function transposeCSVData(data, delimiter) {
    const rows = data.split("\n");
    const cells = [];
    let highestColumnCount = 0;
    rows.forEach(function(row) {
        cells.push(row.split(delimiter));
        if (row.length > highestColumnCount) highestColumnCount = row.length;
    });
    const newCells = [];
    for (let colIndex = 0; colIndex < highestColumnCount; colIndex++) {
        const newRow = [];
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            newRow.push(cells[rowIndex][colIndex]);
        }
        newCells.push(newRow);
    }
    let result = "";
    newCells.forEach(function(newRow) {
        result += newRow.join(delimiter) + "\n";
    })
    return result;
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
    writeInTextAnswersPanelSpecification = null;
    observationsPanelSpecification = null;
    interpretationsPanelSpecification = null;
    
    modelForPatternsGrid = {patterns: []};
    patternsGrid: GridWithItemPanel;
    currentPattern = null;
    
    activeObservationTab = 0;
    observationAccessors: ObservationAccessor[] = [];

    graphHolder: GraphHolder;
    
    modelForStoryGrid: {storiesSelectedInGraph: Story[]} = {storiesSelectedInGraph: []};
    storyGridFieldSpecification: any = null;
    storyGrid: GridWithItemPanel = null;

    graphMultiChoiceQuestionsAgainstThemselves = false;
    hidePatternsWithoutStoryQuestions = false;
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

    static getOrSetWhetherLumpingCommandsShouldBeUsedForPattern(project: Project, catalysisReportIdentifier: string, pattern, newValue = undefined) {
        const patternReference = JSON.stringify({"patternDisplayConfiguration": PatternExplorer.patternReferenceForPatternAndIndex(pattern, 0)});
        const configurationObject: PatternDisplayConfiguration = project.tripleStore.queryLatestC(catalysisReportIdentifier, patternReference) || {};
        if (newValue === undefined) {
            if (configurationObject.useLumpingCommands !== undefined) {
                return configurationObject.useLumpingCommands;
            } else {
                return true; // assume that lumping commands are being used unless they are turned off for a pattern
            }
        } else {
            configurationObject.useLumpingCommands = newValue;
            project.tripleStore.addTriple(catalysisReportIdentifier, patternReference, configurationObject);
            return configurationObject.useLumpingCommands;
        }
    }

    static getOrSetWhetherPatternIsMarkedAsRemarkable(project: Project, catalysisReportIdentifier: string, pattern, newValue = undefined) {
        const patternReference = JSON.stringify({"patternDisplayConfiguration": PatternExplorer.patternReferenceForPatternAndIndex(pattern, 0)});
        const configurationObject: PatternDisplayConfiguration = project.tripleStore.queryLatestC(catalysisReportIdentifier, patternReference) || {};
        if (newValue === undefined) {
            if (configurationObject.remarkable !== undefined) {
                return configurationObject.remarkable;
            } else {
                return undefined;
            }
        } else {
            configurationObject.remarkable = newValue;
            project.tripleStore.addTriple(catalysisReportIdentifier, patternReference, configurationObject);
            return configurationObject.remarkable;
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
            correlationMapIncludeScaleEndLabels: Project.default_correlationMapIncludeScaleEndLabels,
            correlationMapCircleDiameter: Project.default_correlationMapCircleDiameter,
            correlationLineChoice: Project.default_correlationLineChoice,
            customLabelLengthLimit: Project.default_customLabelLengthLimit,
            customGraphWidth: Project.default_customDisplayGraphWidth,
            customGraphHeight: Project.default_customDisplayGraphHeight,
            customGraphPadding: Project.default_customGraphPadding,
            hideNumbersOnContingencyGraphs: false,
            graphTypesToCreate: Project.default_graphTypesToCreate,
            patternDisplayConfiguration: {hideNoAnswerValues: false, useLumpingCommands: true},
            lumpingCommands: {}
        };
        
        this.setUpEditingPanels(args);
        
        // Pattern grid initialization
        this.questionsToInclude = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionsToInclude"); 
        this.modelForPatternsGrid.patterns = this.buildPatternList();
        const patternsGridConfiguration = {
            idProperty: "id",
            columnsToDisplay: true,
            navigationButtons: true,
            specialHiddenPanelForPatternExplorer: true,
            selectCallback: this.patternSelected.bind(this)
        };
        const patternsGridFieldSpecification = {
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
                    displayPrompt: "These are some <strong>things you can do</strong> based on the pattern above and the selection you have made in it (if any).",
                    displayType: "select",
                    displayWithoutQuestionDivs: true,
                    valueOptions: [
                        "Show survey questions for this pattern",
                        "Show statistical results",
                        "Show selected stories in separate window for copying", 
                        "Show random sample of 10 selected stories", 
                        "Show random sample of 20 selected stories", 
                        "Show random sample of 30 selected stories",
                        'Toggle display of "No answer" values for this pattern',
                        'Toggle display lumping for this pattern',
                        "Save current selection (will appear in text box below)",
                        "Restore saved selection (position cursor in text box)",
                        "Save graph(s) as SVG file(s)",
                        "Save graph(s) as PNG file(s)",
                        "Save graph(s) as CSV file"],
                },
                {
                    id: "thingsYouCanDoPanel_doThingsWithSelectedStories",
                    displayPrompt: "Do it",
                    displayIconClass: "doItButtonImage",
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
                        displayPrompt: "These are some <strong>things you can do</strong> based on the pattern above.",
                        displayType: "select",
                        displayWithoutQuestionDivs: true,
                        valueOptions: [
                            "Show statistical results",
                            "Save graph(s) as SVG file(s)",
                            "Save graph(s) as PNG file(s)",
                            "Save graph(s) as CSV file"],
                    },
                    {
                        id: "thingsYouCanDoPanel_doThingsWithSelectedStories",
                        displayPrompt: "Do it",
                        displayIconClass: "doItButtonImage",
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
        this.writeInTextAnswersPanelSpecification = {
            "id": "writeInTextAnswersPanel",
            panelFields: [
                {
                    id: "writeInTextAnswersPanel_texts",
                    valuePath: "currentWriteInTextAnswers",
                    displayName: "Write-in text answers",
                    displayPrompt: "These are the <strong>write-in texts</strong> your participants wrote for this question. They are sorted alphabetically. Answers with a number in parentheses were entered more than once. To include any of these answers in your catalysis report, copy and paste them into your observation.",
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
                    displayPrompt: "Enter an <strong>observation</strong> about the pattern here. (To add another, click the plus button.)",
                    displayType: "textarea"
                },
                {
                    id: "observationPanel_title",
                    valuePath: "/clientState/observationAccessor/observationTitle",
                    displayName: "Observation title",
                    displayPrompt: "Give the observation a short <strong>name</strong>. This name will represent it during clustering and will be its heading in the printed report.",
                    displayType: "text",
                    displayConfiguration: "20"
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
                    id: "observationPanel_showOrHideAdvancedOptions",
                    valueType: "none",
                    displayType: "button",
                    displayConfiguration: "showOrHideAdvancedOptions",
                    displayName: "Show/hide advanced options",
                    displayIconClass: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "hideButtonImage" : "showButtonImage"; },
                    displayPrompt: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options"; },
                    displayPreventBreak: false,
                    displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
                },
                {
                    id: "observationPanel_linkingQuestion",
                    valuePath: "/clientState/observationAccessor/observationLinkingQuestion",
                    displayName: "Observation linking question",
                    displayPrompt: `You might want to enter a <strong>linking question</strong> that will connect this observation 
                        to its interpretations (e.g., "Why did people say ___?").
                        It will be printed in the report before the interpretations.`,
                    displayType: "text",
                    displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
                },
                {
                    id: "observationPanel_observationNote",
                    valuePath: "/clientState/observationAccessor/observationNote",
                    displayName: "Observation note",
                    displayPrompt: `You might want to save a <strong>note</strong> to yourself about this observation. 
                        It will not be printed in the report.`,
                    displayType: "textarea",
                    displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
                },
                {
                    id: "observationPanel_extraPatterns",
                    valuePath: "/clientState/observationAccessor/observationExtraPatterns",
                    displayName: "Observation extra patterns",
                    displayPrompt: `To <strong>include additional patterns</strong>, describe each pattern on a separate line. 
                        Enter its question names exactly as you see them in the table above, in the same order, separated by two equals signs.
                        (For details, see the help system.)`,
                    displayType: "textarea",
                    displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
                    
                },
                {
                    id: "observationPanel_savedGraphSelections",
                    valuePath: "/clientState/observationAccessor/observationSavedGraphSelections",
                    displayName: "Graph selections",
                    displayPrompt: 'These are <strong>selections you have saved</strong> for this pattern. (For details, see the help system.)',
                    displayType: "textarea",
                    displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
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
                    displayConfiguration: {
                        itemPanelID: "panel_addInterpretation",
                        gridConfiguration: {
                            addButton: true,
                            removeButton: true, 
                            duplicateButton: true,
                       }
                    },
                    displayName: "Interpretations",
                    displayPrompt: "Enter at least two <strong>competing interpretations</strong> for this observation. Click on an interpretation to edit it.",
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
        const catalysisReportIdentifier = this.getCurrentCatalysisReportIdentifier(args);
        if (catalysisReportIdentifier !== this.catalysisReportIdentifier) {
            this.catalysisReportIdentifier = catalysisReportIdentifier;
            this.currentCatalysisReportChanged(this.catalysisReportIdentifier);
        }
        
        let parts;
        
        function isMissingQuestionsToInclude(questionsToInclude) {
            if (!questionsToInclude) return true;
            for (let key in questionsToInclude) {
                if (questionsToInclude[key]) return false;
            }
            return true; 
        }

        function isMissingGraphTypesToCreate(graphTypesToCreate) {
            if (!graphTypesToCreate) return true;
            for (let key in graphTypesToCreate) {
                if (graphTypesToCreate[key]) return false;
            }
            return true; 
        }

        const buildObservationsAndInterpretationsPanels = () => {
            const result = [];

            let remarkable = PatternExplorer.getOrSetWhetherPatternIsMarkedAsRemarkable(this.project, this.catalysisReportIdentifier, this.currentPattern);

            // update legacy data in which the remarkable value is not set but there is an observation (so the remarkable value SHOULD be set to "yes")
            if (!remarkable && this.observationAccessors.length > 0) {
                remarkable = PatternExplorer.getOrSetWhetherPatternIsMarkedAsRemarkable(this.project, this.catalysisReportIdentifier, this.currentPattern, "yes");
            }
            let remarkableItems = [];
            remarkableItems.push(m("span.narrafirma-mark-pattern-text", ["Is this pattern ", m("b", "remarkable"), "?"]));
            remarkableItems.push(m("button", {class: "narrafirma-mark-pattern-button", 
                onclick: this.setRemarkableFlag.bind(this, "yes"), disabled: remarkable === "yes"}, m("span.button-text ", "yes"))); 
            remarkableItems.push(m("button", {class: "narrafirma-mark-pattern-button", 
                onclick: this.setRemarkableFlag.bind(this, "maybe"), disabled: remarkable === "maybe"}, m("span.button-text ", "maybe")));
            remarkableItems.push(m("button", {class: "narrafirma-mark-pattern-button", 
                onclick: this.setRemarkableFlag.bind(this, "no"), disabled: remarkable === "no"}, m("span.button-text ", "no")));
            remarkableItems.push(m("button", {class: "narrafirma-mark-pattern-button", 
                onclick: this.setRemarkableFlag.bind(this, "redundant"), disabled: remarkable === "redundant"}, m("span.button-text ", "redundant")));
            remarkableItems.push(m("button", {class: "narrafirma-mark-pattern-button", 
                onclick: this.setRemarkableFlag.bind(this, ""), disabled: remarkable === undefined || remarkable === ""}, 
                m("span.button-text ", "unmarked"))); 
            result.push(m("div", remarkableItems));

            if (this.observationAccessors.length === 0) {
                result.push(m("button", {style: "margin-left: 0.8em", 
                    disabled: remarkable !== "yes",
                    onclick: this.addObservationTabClick.bind(this),}, m("span", {class: "buttonWithTextImage addButtonImage"}), "Add observation"));
            } else {
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
                    disabled: remarkable !== "yes",
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
                result.push(m(".narrafirma-tabs", m(".narrafirma-tabs-header", tabs), m(".narrafirma-tabs-body", tabContents)));
            }
            return result;
        }

        if (!this.catalysisReportIdentifier) {
            parts = [m("div.narrafirma-choose-catalysis-report", "Please select a catalysis report to work with.")];
        } else if (isMissingQuestionsToInclude(this.questionsToInclude)) {
            parts = [m("div.narrafirma-choose-questions-to-include", {style: "text-align: center; margin: 2em"}, "Nothing to see here! Please select some questions to include in the report (on the previous page).")];
        } else if (isMissingGraphTypesToCreate(this.graphTypesToCreate)) {
            parts = [m("div.narrafirma-choose-graph-types-to-include", {style: "text-align: center; margin: 2em"}, "Nothing to see here! Please select some graph types to include in the report (on the previous page).")];
        } else {
            const patternsAndStrengthsToDisplayAbovePatternsTable = this.patternsAndStrengthsToDisplayAbovePatternsTable();

            const cancelButton = m("button.narrafirma-statistics-cancel-button", {
                onclick: () => {
                    this.calculationsCanceled = true;
                    this.progressMessage = "";
                }
            }, "Cancel");
            const buildGridHeader = () => {
                return m("div.patterns-grid-header", 
                    m("div#gridHeaderProgressMessage" + (this.progressMessage ? ".pleaseWaitStatisticsOverlay" : ""), this.progressMessage),
                    this.progressMessage ? cancelButton : [],
                    patternsAndStrengthsToDisplayAbovePatternsTable, 
                );
            };

            let activeAccessor = null;
            if (this.observationAccessors.length > this.activeObservationTab)
            activeAccessor = this.observationAccessors[this.activeObservationTab];

            // this calculateView might have been called because another user changed something in the data
            if (clientState.redrawingDueToIncomingMessage()) {
                this.patternsGrid.updateData();
                // they may have added a new observation 
                this.updatePatternObservationIDs(this.currentPattern);
                this.updateObservationPanelForSelectedPattern();
            }

            const stories = this.modelForStoryGrid.storiesSelectedInGraph;

            if (this.currentPattern && (this.currentPattern.graphType === "data integrity" || this.currentPattern.graphType === "correlation map")) {
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(args),
                    m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                    panelBuilder.buildPanel(this.thingsYouCanDoIfNoSelectionPanelSpecification, activeAccessor || this),
                    buildObservationsAndInterpretationsPanels(),
                ];
            } else if (this.currentPattern && this.currentPattern.graphType === "texts") {
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(args),
                    panelBuilder.buildPanel(this.textAnswersPanelSpecification, this),
                    buildObservationsAndInterpretationsPanels(),
                ];
            } else if (this.currentPattern && this.currentPattern.graphType === "write-in texts") {
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(args),
                    panelBuilder.buildPanel(this.writeInTextAnswersPanelSpecification, this),
                    buildObservationsAndInterpretationsPanels(),
                ];
            } else { 
                const numStories = stories.length;
                const storyOrStoriesWord = (numStories > 1) ? "stories" : "story";
                const selectedStoriesText = numStories + " " + storyOrStoriesWord + " in selection - " 
                    + this.nameForCurrentGraphSelection() + ". Click on a story to view it.";
                parts = [
                    buildGridHeader(),
                    this.patternsGrid.calculateView(args),
                    this.currentPattern ?
                        [
                            m("div.narrafirma-graph-results-panel", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                            this.graphHolder.currentGraph ? "" : m("div.narrafirma-pattern-browser-no-graph-message", 
                                "The number of stories for this pattern falls below the minimum count of " + this.graphHolder.minimumStoryCountRequiredForGraph 
                                + ", which you set on the Configure catalysis report page"
                                + ". To display this graph, choose a lower minimum story count."),
                            (stories.length > 0) ? 
                                m("div.narrafirma-pattern-browser-selected-stories-header", selectedStoriesText) : 
                                m("div.narrafirma-pattern-browser-no-selection-tip", "Click and drag in the graph(s) above to select stories to view."),
                            (stories.length > 0) ? this.storyGrid.calculateView(args) : m("div"),
                            panelBuilder.buildPanel(this.thingsYouCanDoPanelSpecification, activeAccessor || this),
                            buildObservationsAndInterpretationsPanels(),
                        ] :
                        m("div.narrafirma-choose-pattern", "Please choose a pattern to view in the table above.")
                ];
            }
            parts.push(
                m("div.narrafirma-pattern-browser-bottombuttons", [
                    m("button.narrafirma-pattern-browser-export", {onclick: () => {this.exportAllPatternGraphs(); }}, "Export All Pattern Graphs"),
                    m("button.narrafirma-pattern-browser-export", {onclick: () => {this.exportAllPatternStatistics(); }}, "Export All Statistics")
                ]));
        }
        return m("div.narrafirma-patterns-grid", parts);
    }

    setRemarkableFlag(newValue: string) {
        if (!this.currentPattern) return; 
        const oldValue = PatternExplorer.getOrSetWhetherPatternIsMarkedAsRemarkable(this.project, this.catalysisReportIdentifier, this.currentPattern);
        PatternExplorer.getOrSetWhetherPatternIsMarkedAsRemarkable(this.project, this.catalysisReportIdentifier, this.currentPattern, newValue);
        if (oldValue !== newValue) this.updateGraphForNewPattern(this.currentPattern);
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

        result += this.modelForPatternsGrid.patterns.length + (this.modelForPatternsGrid.patterns.length !== 1 ? " patterns" : " pattern");
        if (Object.keys(strengthCounts).length) {
            result += ", " + nonBlankObservations.length + (nonBlankObservations.length !== 1 ? " observations" : " observation");
            result += " (by strength, ";
            let keyCount = 0;
            Object.keys(strengthCounts).forEach(function(key) {
                result += key.slice(0,1) + ": " + strengthCounts[key];
                if (keyCount < 2) result += "; ";
                keyCount++;
            });
            result += "; none: " + numObservationsWithoutStrengths + "), ";
        }
        result += numInterpretations + (numInterpretations !== 1 ? " interpretations" : " interpretation");
        result += ". Click on a pattern to view it."
        return m("div.narrafirma-catalysis-patterns-grid-label", result);
    }

    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }


    exportAllPatternGraphs() {

        const patterns = this.modelForPatternsGrid.patterns;

        if (patterns.length > 100) {
            const response = confirm("You are exporting graphs from " + patterns.length 
                + " patterns, some of which could generate several graphs. "
                + "This could take a long time and create a large zip file. Are you certain that you want to do this?")
            if (!response) return;
        }

        // note that this code was brute-force copied and pasted from printing.ts
        // i had it there but calling PatternExplorer.makeGraph created a circular reference
        // it should probably be moved to its own file, but there are some differences, so maybe this is okay

        const progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating graphs", "Cancel", dialogCancelled);
        
        const project = this.project;
        const reportID = this.catalysisReportIdentifier;
        const allStories = this.project.storiesForCatalysisReport(this.catalysisReportIdentifier);
        const catalysisReportName = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "catalysisReport_shortName");

        const options = []; 
        options["outputGraphFormat"] = "PNG"; // hard coding this for now
        // these are the ones I think I must support
        options["lumpingCommands"] = project.lumpingCommandsForCatalysisReport(reportID); 
        options["minimumStoryCountRequiredForGraph"] = project.tripleStore.queryLatestC(reportID, "minimumStoryCountRequiredForGraph") || Project.default_minimumStoryCountRequiredForGraph; 
        options["numHistogramBins"] = project.tripleStore.queryLatestC(reportID, "numHistogramBins") || Project.default_numHistogramBins; 
        options["numScatterDotOpacityLevels"] = project.tripleStore.queryLatestC(reportID, "numScatterDotOpacityLevels") || Project.default_numScatterDotOpacityLevels; 
        options["scatterDotSize"] = project.tripleStore.queryLatestC(reportID, "scatterDotSize") || Project.default_scatterDotSize; 
        options["correlationMapShape"] = project.tripleStore.queryLatestC(reportID, "correlationMapShape") || Project.default_correlationMapShape; 
        options["correlationMapIncludeScaleEndLabels"] = project.tripleStore.queryLatestC(reportID, "correlationMapIncludeScaleEndLabels") || Project.default_correlationMapIncludeScaleEndLabels; 
        options["correlationMapCircleDiameter"] = parseInt(project.tripleStore.queryLatestC(reportID, "correlationMapCircleDiameter")) || Project.default_correlationMapCircleDiameter; 
        options["correlationLineChoice"] = project.tripleStore.queryLatestC(reportID, "correlationLineChoice") || Project.default_correlationLineChoice; 
        options["customLabelLengthLimit"] = parseInt(project.tripleStore.queryLatestC(reportID, "customLabelLengthLimit") || Project.default_customLabelLengthLimit); 
        options["hideNumbersOnContingencyGraphs"] = project.tripleStore.queryLatestC(reportID, "hideNumbersOnContingencyGraphs") || false;
        options["customGraphWidth"] = parseInt(project.tripleStore.queryLatestC(reportID, "customReportGraphWidth")) || Project.default_customReportGraphWidth;
        options["customGraphHeight"] = parseInt(project.tripleStore.queryLatestC(reportID, "customReportGraphHeight")) || Project.default_customReportGraphHeight;

        const zipFile = new jszip();
        let savedGraphCount = 0;
        const graphTypesThatDontGetPrinted = ["texts", "write-in texts"];
    
        function printGraphToZipFile(zipFile, graphHolder, graphNode, graphTitle, options) {
            const svgNode = graphNode.querySelector("svg");
            if (svgNode) {
                // i am not using the svg option, but might as well keep it in case i want it later
                if (options.outputGraphFormat === "SVG") {
                    const svgFileText = graphStyle.prepareSVGToSaveToFile(svgNode, options.customGraphCSS, graphHolder.outputFontModifierPercent);
                    zipFile.file(graphTitle + ".svg", svgFileText);
                    savedGraphCount++;
                } else if (options.outputGraphFormat === "PNG") {
                    // when using canvas.toBlob either the ZIP file or the PNG files come out corrupted
                    // found this method to fix it online and it works
                    const canvas = graphStyle.preparePNGToSaveToFile(svgNode, options.customGraphCSS, graphHolder.outputFontModifierPercent);
                    const dataURI = canvas.toDataURL("image/png");
                    const imageData = graphStyle.dataURItoBlob(dataURI);
                    zipFile.file(graphTitle + ".png", imageData, {binary: true});
                    savedGraphCount++;
                }
            }
        }
    
        let patternIndex = 0;

        function printNextPattern() {

            function customGraphHolder(allStories, options) {
                const graphHolder: GraphHolder = {
                    // things that are not options
                    allStories: allStories,
                    graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane chartEnclosure"),

                    // things that don't apply to this usage but should be set just in case
                    currentGraph: null,
                    currentSelectionExtentPercentages: null,
                    excludeStoryTooltips: true,
                    chartPanes: [],
                    minimumStoryCountRequiredForTest: 20,
                    showStatsPanelsInReport: false,
                    customStatsTextReplacements: null,
                    patternDisplayConfiguration: {hideNoAnswerValues: false, useLumpingCommands: true},
                    adjustedCSS: null,
                    graphTypesToCreate: {},

                    // things that should come from the report settings
                    lumpingCommands: options.lumpingCommands,
                    minimumStoryCountRequiredForGraph: options.minimumStoryCountRequiredForGraph,
                    numHistogramBins: options.numHistogramBins,
                    numScatterDotOpacityLevels: options.numScatterDotOpacityLevels,
                    scatterDotSize: options.scatterDotSize,
                    correlationMapShape: options.correlationMapShape,
                    correlationMapIncludeScaleEndLabels: options.correlationMapIncludeScaleEndLabels,
                    correlationMapCircleDiameter: options.correlationMapCircleDiameter,
                    correlationLineChoice: options.correlationLineChoice,
                    customLabelLengthLimit: options.customLabelLengthLimit,
                    hideNumbersOnContingencyGraphs: options.hideNumbersOnContingencyGraphs,  
                    customGraphWidth: options.customGraphWidth,
                    customGraphHeight: options.customGraphHeight,                  
                    
                    // things i want to set just for this output
                    outputGraphFormat: options.outputGraphFormat,
                    outputFontModifierPercent: 120, // these always seem to come out tiny

                    // note that there are some fields on the config page that are not here
                    // because they are not in the graphHolder
                    // like the story collection date time unit and the story length categories
                    // i am ignoring them because this brute-force output is getting out of hand
                };
                return graphHolder;
            }
    
            function nicerGraphTypeName(name) {
                const nicerGraphTypeNames = {
                    "data integrity": "data integrity graphs",
                    "bar": "bar charts",
                    "histogram": "histograms",
                    "multiple histogram": "histograms for choice subsets",
                    "scatter": "scatter plots",
                    "multiple scatter": "scatter plots for choice subsets",
                    "table": "contingency charts",
                    "contingency-histogram": "contingency charts with scale values",
                    "correlation map": "correlation maps"
                }
                return nicerGraphTypeNames[name] || name;
            }
    
            if (progressModel.cancelled) {
                alert("Cancelled after working on " + (patternIndex + 1) + " pattern(s)");
            } else if (patternIndex >= patterns.length) {
                progressModel.hideDialogMethod();
                if (savedGraphCount > 0) {
                        const finishModel = dialogSupport.openFinishedDialog(
                            "Done creating zip file of " + savedGraphCount + " images; save it? (Note: saving the file might take a while.)", 
                            "Finished generating images", "Save", "Cancel", 
                            function(dialogConfiguration, hideDialogMethod) {
                                toaster.toast("Saving file, please wait...");
                                const fileName = catalysisReportName + " pattern graphs " + options["outputGraphFormat"] + ".zip";
                                zipFile.generateAsync({type: "blob", platform: "UNIX", compression: "DEFLATE"}).then(function (blob) {saveAs(blob, fileName); });
                                hideDialogMethod();
                            }
                        );
                    finishModel.redraw();
                } else {
                    alert("No graphs were found with your current selection criteria. Try choosing different graph types.");
                }
                progressModel.redraw();
            } else {
                const pattern = patterns[patternIndex];
                if (pattern && graphTypesThatDontGetPrinted.indexOf(pattern.graphType) < 0) {
                    let graphTitle = pattern.patternName;
                    graphTitle = replaceAll(graphTitle, "/", " "); // jszip interprets a forward slash as a folder designation
                    graphTitle = nicerGraphTypeName(pattern.graphType) + "/" + graphTitle; // place files into folders by type
                    const graphHolder = customGraphHolder(allStories, options);
                    const selectionCallback = function() { return this; };
                    const graph = PatternExplorer.makeGraph(pattern, graphHolder, selectionCallback, !options["showStatsPanelsInReport"]);
                    if (graphHolder.chartPanes.length > 1) {
                        for (let graphIndex = 1; graphIndex < graphHolder.chartPanes.length; graphIndex++) { // start at 1 to skip over title pane
                            const graphNode = graphHolder.chartPanes[graphIndex];
                            if (graphNode) {
                                const choiceTitle = replaceAll(graph[graphIndex-1].subgraphChoice, "/", " "); // subtract 1 because 1 is title pane
                                const subGraphTitle = graphTitle + "/" + choiceTitle; // place subgraphs into folders
                                printGraphToZipFile(zipFile, graphHolder, graphNode, subGraphTitle, options);
                            }
                        } 
                    } else {
                        const graphNode = <HTMLElement>graphHolder.graphResultsPane.firstChild;
                        if (graphNode) printGraphToZipFile(zipFile, graphHolder, graphNode, graphTitle, options);
                    }
                }
                progressModel.progressText = progressText(patternIndex);
                progressModel.redraw();
                patternIndex++;
                setTimeout(function() { printNextPattern(); }, 0);
            }
        }
    
        function progressText(patternIndex: number) {
            return "Pattern " + (patternIndex + 1) + " of " + patterns.length;
        }
        
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
        
        setTimeout(function() { printNextPattern(); }, 0); 
    }

    exportAllPatternStatistics() {
        const progressModel = dialogSupport.openProgressDialog("Starting up...", "Generating statistics for export", "Cancel", dialogCancelled);

        let numPatternsWritten = 0;
        let patternIndex = 0;
        const delimiter = Globals.clientState().csvDelimiter();
        const headerLine = ["Number", "Pattern", "Graph type", "Summary", "Details", "Subset details"];
        let output = [];
        output = csvImportExport.addCSVOutputLine(output, headerLine, delimiter);

        const patterns = this.modelForPatternsGrid.patterns;
        const catalysisReportName = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "catalysisReport_shortName");
        const allStories = this.project.storiesForCatalysisReport(this.catalysisReportIdentifier);
        
        function printStatsForNextPattern() {
            if (progressModel.cancelled) {
                alert("Cancelled after working on " + (patternIndex + 1) + " pattern(s)");
            } else if (patternIndex >= patterns.length) {
                progressModel.hideDialogMethod();
                if (numPatternsWritten > 0) {
                    const finishModel = dialogSupport.openFinishedDialog("Done creating CSV file of pattern statistics; save it?", 
                            "Finished generating CSV file", "Save", "Cancel", function(dialogConfiguration, hideDialogMethod) {
                        const fileName = catalysisReportName + " pattern statistics.csv";
                        const exportBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
                        saveAs(exportBlob, fileName);
                        hideDialogMethod();
                    });
                    finishModel.redraw();
                } else {
                    alert("No patterns were found with your current selection criteria. Try choosing different graph types.");
                }
                progressModel.redraw();
            } else {
                const pattern = patterns[patternIndex];
                if (pattern) {
                    const line = [];
                    line.push(patternIndex + 1);
                    line.push(pattern.patternName || "");
                    line.push(pattern.graphType || "");
                    line.push(pattern.statsSummary || "");
                    line.push(pattern.statsDetailed && pattern.statsDetailed.length > 0 ? pattern.statsDetailed.join("; ") : "");
                    if (pattern.allStatResults) {
                        for (let outerKey of Object.keys(pattern.allStatResults)) {
                            const resultDict = pattern.allStatResults[outerKey];
                            let thisResultText = outerKey + " | ";
                            for (let innerKey of Object.keys(resultDict)) {
                                thisResultText += " " + innerKey + ": " + resultDict[innerKey];
                            }
                            line.push(thisResultText);
                        }
                    }
                    output = csvImportExport.addCSVOutputLine(output, line, delimiter);
                    }
                    numPatternsWritten++;
                progressModel.progressText = progressText(patternIndex);
                progressModel.redraw();
                patternIndex++;
                setTimeout(function() { printStatsForNextPattern(); }, 0);
                }
        }
    
        function progressText(observationIndex: number) {
            return "Pattern " + (observationIndex + 1) + " of " + patterns.length;
        }
        
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
        
        setTimeout(function() { printStatsForNextPattern(); }, 0);
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // updating data
    //------------------------------------------------------------------------------------------------------------------------------------------
    
    currentCatalysisReportChanged(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) return;

        // update options kept in this object
        this.graphTypesToCreate = this.project.tripleStore.queryLatestC(catalysisReportIdentifier, "graphTypesToCreate") || Project.default_graphTypesToCreate;
        this.graphMultiChoiceQuestionsAgainstThemselves = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "graphMultiChoiceQuestionsAgainstThemselves"); 
        this.hidePatternsWithoutStoryQuestions = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "hidePatternsWithoutStoryQuestions"); 
        this.hideStatsPanels = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "hideStatsPanelsOnExplorePatternsPage"); 
        this.catalysisReportObservationSetIdentifier = this.getObservationSetIdentifier(catalysisReportIdentifier);

        // update options kept in graph holder
        this.graphHolder.minimumStoryCountRequiredForTest = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "minimumSubsetSize") || Project.default_minimumStoryCountRequiredForTest; 
        this.graphHolder.minimumStoryCountRequiredForGraph = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "minimumStoryCountRequiredForGraph") || Project.default_minimumStoryCountRequiredForGraph; 
        this.graphHolder.numHistogramBins = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "numHistogramBins") || Project.default_numHistogramBins; 
        this.graphHolder.numScatterDotOpacityLevels = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "numScatterDotOpacityLevels") || Project.default_numScatterDotOpacityLevels; 
        this.graphHolder.scatterDotSize = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "scatterDotSize") || Project.default_scatterDotSize; 
        this.graphHolder.correlationMapShape = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationMapShape") || Project.default_correlationMapShape; 
        this.graphHolder.correlationMapIncludeScaleEndLabels = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationMapIncludeScaleEndLabels") || Project.default_correlationMapIncludeScaleEndLabels; 
        this.graphHolder.correlationMapCircleDiameter = parseInt(this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationMapCircleDiameter")) || Project.default_correlationMapCircleDiameter; 
        
        this.graphHolder.correlationLineChoice = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "correlationLineChoice") || Project.default_correlationLineChoice; 
        this.graphHolder.customLabelLengthLimit = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customLabelLengthLimit") || Project.default_customLabelLengthLimit; 
        this.graphHolder.customGraphWidth = parseInt(this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customDisplayGraphWidth")) || Project.default_customDisplayGraphWidth; 
        this.graphHolder.customGraphHeight = parseInt(this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customDisplayGraphHeight")) || Project.default_customDisplayGraphHeight; 
        this.graphHolder.customGraphPadding = parseInt(this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "customGraphPadding")) || Project.default_customGraphPadding; 
        
        this.graphHolder.hideNumbersOnContingencyGraphs = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "hideNumbersOnContingencyGraphs"); 
        this.updateStyleSheetForCustomGraphCSS();

        // get stories 
        this.graphHolder.allStories = this.project.storiesForCatalysisReport(catalysisReportIdentifier);
        this.numStoryCollectionsIncludedInReport = this.project.numStoryCollectionsInCatalysisReport(catalysisReportIdentifier);

        // gather questions for patterns table
        const leadingStoryQuestions = questionnaireGeneration.getStoryNameAndTextQuestions();
        const elicitingQuestions = this.project.elicitingQuestionsForCatalysisReport(catalysisReportIdentifier);
        const numStoriesToldQuestions = this.project.numStoriesToldQuestionsForCatalysisReport(catalysisReportIdentifier);
        const storyLengthQuestions = this.project.storyLengthQuestionsForCatalysisReport(catalysisReportIdentifier);
        const collectionDateQuestions = this.project.collectionDateQuestionsForCatalysisReport(catalysisReportIdentifier);
        const languageQuestions = this.project.languageQuestionsForCatalysisReport(catalysisReportIdentifier);
        const storyQuestions = this.project.storyQuestionsForCatalysisReport(catalysisReportIdentifier); 
        const participantQuestions = this.project.participantQuestionsForCatalysisReport(catalysisReportIdentifier);
        const annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        this.questions = [];
        this.questions = this.questions.concat(leadingStoryQuestions, elicitingQuestions, numStoriesToldQuestions, storyLengthQuestions, 
            collectionDateQuestions, languageQuestions, storyQuestions, participantQuestions, annotationQuestions);
        this.questionsToInclude = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionsToInclude"); 
        this.graphHolder.lumpingCommands = this.project.lumpingCommandsForCatalysisReport(this.catalysisReportIdentifier); 

        // adjust patterns grid for showing or hiding columns
        let columnIDsToShow = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "columnIDsToShowInPatternsTable");
        if (columnIDsToShow === undefined) columnIDsToShow = columnIDsToShowIfNoOptionsSaved;
        const allColumnIDs = Object.keys(columnIDsToDisplayNamesMap);
        this.patternsGridFieldSpecification.itemPanelSpecification.panelFields = [{id: "id", displayName: "Index", valueOptions: []}];
        allColumnIDs.forEach( (columnID) => {
            if (columnIDsToShow[columnID]) {
                const columnSpec = {id: columnID, displayName: columnIDsToDisplayNamesMap[columnID], valueOptions: []};
                this.patternsGridFieldSpecification.itemPanelSpecification.panelFields.push(columnSpec);
            }
        })
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

        const nominalQuestions = [];
        const scaleQuestions = [];
        const textQuestions = [];
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

        const result = this.buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, true);

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

        let patternIndex = 0;
        const howOftenToUpdateProgressMessage = 20; 
        const stories = this.graphHolder.allStories;
        const minimumStoryCountRequiredForTest = this.graphHolder.minimumStoryCountRequiredForTest;

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
                const useLumpingCommands = PatternExplorer.getOrSetWhetherLumpingCommandsShouldBeUsedForPattern(project, this.catalysisReportIdentifier, result[patternIndex]);
                let lumpingCommands = {};
                if (useLumpingCommands) {
                    lumpingCommands = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "lumpingCommands") || ""; 
                }
                calculateStatistics.calculateStatisticsForPattern(result[patternIndex], stories, 
                    minimumStoryCountRequiredForTest, "No answer", !hideNoAnswerValues, lumpingCommands,
                    progressUpdater, patternIndex, result.length, howOftenToUpdateProgressMessage);
                patternIndex += 1;
                if (!self.calculationsCanceled) {
                    setTimeout(function() { calculateStatsForNextPattern(); }, 1);
                }
            }
        }
    
        return result;
    }

    hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2, question3 = null) {
        if (!this.hidePatternsWithoutStoryQuestions) return false;
        if (question3) {
            return (question1.id.indexOf("S_") < 0 && question2.id.indexOf("S_") < 0 && question3.id.indexOf("S_") < 0);
        } else {
            return (question1.id.indexOf("S_") < 0 && question2.id.indexOf("S_") < 0);
        }
    }

    buildOrCountPatternList(nominalQuestions, scaleQuestions, textQuestions, build) {
        const result = [];
        let graphCount = 0;

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

        // write-in texts
        if (this.graphTypesToCreate["write-in texts"]) {
            let allQuestionsWithAWriteInOption = [];
            nominalQuestions.map((question) => { if (question.writeInTextBoxLabel) allQuestionsWithAWriteInOption.push(question); });
            scaleQuestions.map((question) => { if (question.writeInTextBoxLabel) allQuestionsWithAWriteInOption.push(question); });
            textQuestions.map((question) => { if (question.writeInTextBoxLabel) allQuestionsWithAWriteInOption.push(question); });
            allQuestionsWithAWriteInOption.forEach((question1) => {
                if (build) {
                    result.push(this.makePattern(nextID(), "write-in texts", [question1], "Write-in texts"));
                } else {
                    graphCount++;
                }
            });
        };

        // when creating question combinations, prevent mirror duplicates (axb, bxa) and self-matching questions (axa)
        // unless they want axa for multi-choice questions
        let usedQuestions;
        
        // two choice questions
        if (this.graphTypesToCreate["tables"]) {
            usedQuestions = [];
            nominalQuestions.forEach((question1) => {
                usedQuestions.push(question1);
                nominalQuestions.forEach((question2) => {
                    const okayToGraphQuestionAgainstItself = this.graphMultiChoiceQuestionsAgainstThemselves 
                        && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
                    if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                    if (this.hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2)) return;
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
                    if (this.hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2)) return;
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
                    if (this.hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2)) return;
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
                    const okayToGraphQuestionAgainstItself = this.graphMultiChoiceQuestionsAgainstThemselves && question1.displayName === question2.displayName && question2.displayType === "checkboxes";
                    if (!okayToGraphQuestionAgainstItself && usedQuestions.indexOf(question2) !== -1) return;
                    scaleQuestions.forEach((question3) => {
                        if (this.hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2, question3)) return;
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
                        if (this.hidePatternBecauseItDoesNotGoThroughTheStory(question1, question2, question3)) return;
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
            if (scaleQuestions.length >= 3) {
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
        let pattern; 
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

        this.updatePatternObservationIDs(pattern);

        const observationTitleOrDescriptionAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationTitle") || this.getCombinedObservationsInfoForPattern(pattern, "observationDescription");
        };
        const strengthAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationStrength") || "";
        };
        const interpretationsAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationInterpretations") || "";
        };
        const remarkableAccessor = () => {
            const remarkable = PatternExplorer.getOrSetWhetherPatternIsMarkedAsRemarkable(this.project, this.catalysisReportIdentifier, pattern);
            return (remarkable === undefined) ? "" : remarkable;
        }
        const noteAccessor = () => {
            return this.getCombinedObservationsInfoForPattern(pattern, "observationNote") || "";
        };
       
        pattern.observation = observationTitleOrDescriptionAccessor;  // circular reference
        pattern.strength = strengthAccessor;
        pattern.interpretations = interpretationsAccessor;
        pattern.remarkable = remarkableAccessor;
        pattern.note = noteAccessor;
        return pattern;
    }

    updatePatternObservationIDs(pattern) {
        if (!pattern) return;
        pattern.observationIDs = [];
        let index = 0;
        let observationID = "";
        while (observationID !== undefined) {
            observationID = findOrCreateObservationIDForPatternAndIndex(this.project, this.catalysisReportObservationSetIdentifier, pattern, index, false);
            if (observationID) pattern.observationIDs.push(observationID);
            index++;
        }
    }

    patternSelected(selectedPattern) {
        this.activeObservationTab = 0;
        this.updateGraphForNewPattern(selectedPattern);
        this.currentPattern = selectedPattern;
        this.updateObservationPanelForSelectedPattern();
        this.modelForStoryGrid.storiesSelectedInGraph = [];
        this.storyGrid.updateData();
    }

    updateStoriesPane(stories: Story[]) {
        this.modelForStoryGrid.storiesSelectedInGraph = stories;
        this.storyGrid.updateData();
    }
    
    updateObservationPanelForSelectedPattern() {
        if (!this.currentPattern) return;
        this.observationAccessors = [];
        this.currentPattern.observationIDs.forEach(id => {
            const newAccessor = new ObservationAccessor(id);
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
            const chartPane = this.graphHolder.chartPanes.pop();
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

        const oldUseLumpingCommandsChoice = this.graphHolder.patternDisplayConfiguration.useLumpingCommands;
        const newUseLumpingCommandsChoice = PatternExplorer.getOrSetWhetherLumpingCommandsShouldBeUsedForPattern(this.project, this.catalysisReportIdentifier, pattern);
        this.graphHolder.patternDisplayConfiguration.useLumpingCommands = newUseLumpingCommandsChoice; 

        if (oldHideNoAnswerValuesChoice !== newHideNoAnswerValuesChoice || oldUseLumpingCommandsChoice !== newUseLumpingCommandsChoice) {
            const lumpingCommandsToUse = newUseLumpingCommandsChoice ? this.graphHolder.lumpingCommands : {};
            calculateStatistics.calculateStatisticsForPattern(pattern, this.graphHolder.allStories, 
                this.graphHolder.minimumStoryCountRequiredForTest, "No answer", !newHideNoAnswerValuesChoice, lumpingCommandsToUse, null, 0, 0, 0);
        }

        this.graphHolder.statisticalInfo = "";
        this.graphHolder.currentGraph = PatternExplorer.makeGraph(pattern, this.graphHolder, this.updateStoriesPane.bind(this), this.hideStatsPanels);
        this.graphHolder.currentSelectionExtentPercentages = null;
        // TODO: Is this obsolete? this.graphHolder.currentSelectionSubgraph = null;
    }

    static makeGraph(pattern, graphHolder, selectionCallback, hideStatsPanel = false) {
        const graphType = pattern.graphType;
        const q1 = pattern.questions[0];
        const q2 = pattern.questions[1];
        const q3 = pattern.questions[2]
        let newGraph = null;
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
            case "write-in texts":
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

        const questionID = this.currentPattern.questions[0].id; 
        const stories = this.graphHolder.allStories; 
        const answers = {};
        const answerKeys = [];

        stories.forEach(function (story) {
            const text = story.fieldValue(questionID);
            if (text) {
                if (!answers[text]) {
                    answers[text] = 0;
                    answerKeys.push(text);
                }
                answers[text] += 1;
            }
        });
        answerKeys.sort();
        
        let sortedAndFormattedAnswers = "";
        for (let i = 0; i < answerKeys.length; i++) {
            const answer = answerKeys[i];
            sortedAndFormattedAnswers += answer;
            if (answers[answer] > 1) sortedAndFormattedAnswers += " (" + answers[answer] + ") ";
            if (i < answerKeys.length - 1) sortedAndFormattedAnswers +=  "\n--------\n";
        }
        return sortedAndFormattedAnswers;
    }

    currentWriteInTextAnswers() {
        if (!this.catalysisReportObservationSetIdentifier) throw new Error("currentWriteInTextAnswers: this.catalysisReportObservationSetIdentifier is undefined");
        if (!this.currentPattern) return "";
        if (!this.currentPattern.questions[0]) return "";
        if (!this.graphHolder.allStories) return "";

        const questionID = this.currentPattern.questions[0].id; 
        const stories = this.graphHolder.allStories; 
        const answers = {};
        const answerKeys = [];

        stories.forEach(function (story) {
            const writeInText = story.fieldValueWriteIn(questionID);
            if (writeInText) {
                if (!answers[writeInText]) {
                    answers[writeInText] = 0;
                    answerKeys.push(writeInText);
                }
                answers[writeInText] += 1;
            }
        });
        answerKeys.sort();
        
        let sortedAndFormattedAnswers = "";
        for (let i = 0; i < answerKeys.length; i++) {
            const answer = answerKeys[i];
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
        const actionElement = <HTMLTextAreaElement>document.getElementById("thingsYouCanDoPanel_actionRequested");
        const action = actionElement.value;
        switch (action) {
            case "Show survey questions for this pattern":
                this.showSurveyQuestionsForPatternQuestions();
                break;
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
            case 'Toggle display of "No answer" values for this pattern':
                this.toggleNoAnswerDisplayForPattern();
                break;
            case 'Toggle display lumping for this pattern':
                this.toggleUseLumpingCommandsForPattern();
                break;
            case "Save current selection (will appear in text box below)":
                this.saveGraphSelection();
                break;
            case "Restore saved selection (position cursor in text box)":
                this.restoreGraphSelection();
                break;
            case "Save graph(s) as SVG file(s)":
                this.saveGraphAsFile("SVG");
                break;
            case "Save graph(s) as PNG file(s)":
                this.saveGraphAsFile("PNG");
                break;
            case "Save graph(s) as CSV file":
                PatternExplorer.saveGraphAsCSV(this.currentPattern, this.graphHolder);
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

    toggleUseLumpingCommandsForPattern() {
        if (!this.currentPattern) return; 
        const useLumpingCommands = PatternExplorer.getOrSetWhetherLumpingCommandsShouldBeUsedForPattern(this.project, this.catalysisReportIdentifier, this.currentPattern);
        const newValue = !useLumpingCommands;
        PatternExplorer.getOrSetWhetherLumpingCommandsShouldBeUsedForPattern(this.project, this.catalysisReportIdentifier, this.currentPattern, newValue);
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

            for (let i = 0; i < svgNodes.length; i++) {

                let graphTitle = this.graphHolder.currentGraph[i].subgraphChoice;
                graphTitle = replaceAll(graphTitle, "/", " "); // jszip interprets a forward slash as a folder designation 

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

    static saveGraphAsCSV(pattern, graphHolder, saveFile = true) {
        if (!pattern) {
            alert("Please choose a graph.");
            return;
        } 
        const delimiter = Globals.clientState().csvDelimiter();
        let output = "";
        let niceGraphTypeName = "";
        const patternName = pattern.patternName;
        const dataKeys = Object.keys(graphHolder.dataForCSVExport);
        let optionsForFirstQuestion = [];
        let optionsForSecondQuestion = [];
        switch (pattern.graphType) {
            case "bar":
                niceGraphTypeName = "Bar graph";
                // {option: count}
                dataKeys.forEach( function(key) {
                    output += key + delimiter + graphHolder.dataForCSVExport[key] + "\n";
                })
                break;
            case "table":
                niceGraphTypeName = "Table";
                // {option,option: count}
                dataKeys.forEach(function(key) {
                    const parts = key.split(delimiter); 
                    if (optionsForFirstQuestion.indexOf(parts[0]) < 0) optionsForFirstQuestion.push(parts[0]);
                    if (optionsForSecondQuestion.indexOf(parts[1]) < 0) optionsForSecondQuestion.push(parts[1]);
                });
                output += delimiter + optionsForFirstQuestion.join(delimiter) + "\n";
                optionsForSecondQuestion.forEach(function(secondOption) {
                    output += secondOption + delimiter;
                    optionsForFirstQuestion.forEach(function(firstOption) {
                        output += graphHolder.dataForCSVExport[firstOption + delimiter + secondOption] + delimiter;
                    })
                    output += "\n";
                })
                break;
            case "contingency-histogram":
                niceGraphTypeName = "Histogram table";
                // {option x option: [mean, sd, skewness, kurtosis]}
                output += delimiter + "mean" + delimiter + "sd" + delimiter + "skewness" + delimiter + "kurtosis" + delimiter + "values\n";
                dataKeys.forEach( function(key) {
                    output += key + delimiter;
                    output += graphHolder.dataForCSVExport[key].join(delimiter) + "\n";
                })
                output = transposeCSVData(output, delimiter);
                break;
            case "histogram":
                niceGraphTypeName = "Histogram";
                // {question name: bins and values}
                dataKeys.forEach( function(key) {
                    output += graphHolder.dataForCSVExport[key].join("\n");
                })
                break;
            case "multiple histogram":
                niceGraphTypeName = "Histogram set";
                // {option: bins and values}
                dataKeys.forEach( function(key) {
                    output += "\n" + key + "\n";
                    output += graphHolder.dataForCSVExport[key].join("\n") + "\n";
                })
                break;
            case "scatter":
                niceGraphTypeName = "Scatter plot";
                // {question name: array of xy pairs}
                output += "x" + delimiter + "y\n";
                Object.keys(graphHolder.dataForCSVExport).forEach( function(key) {
                    output += graphHolder.dataForCSVExport[key].join("\n");
                })
                break;        
            case "multiple scatter":
                niceGraphTypeName = "Scatter plot set";
                // {option: array of xy pairs}
                Object.keys(graphHolder.dataForCSVExport).forEach( function(key) {
                    output += "\n\n" + key + "\n";
                    output += "x" + delimiter + "y\n";
                    output += graphHolder.dataForCSVExport[key].join("\n");
                })
                break;
            case "data integrity":
                if (["All scale values", "Participant means", "Participant standard deviations"].indexOf(patternName) >= 0) { 
                    niceGraphTypeName = "Histogram";
                    // {data integrity type: bins and values}
                    dataKeys.forEach( function(key) {
                        output += graphHolder.dataForCSVExport[key].join("\n");
                    })
                } else if (["Unanswered choice questions", "Unanswered scale questions"].indexOf(patternName) >= 0) { 
                    niceGraphTypeName = "Bar graph";
                    // {question name: count}
                    dataKeys.forEach( function(key) {
                        output += key + delimiter + graphHolder.dataForCSVExport[key] + "\n";
                    })
                }
                break;
            case "correlation map":
                niceGraphTypeName = "Network map";
                // {option: r,p,n}
                dataKeys.forEach( function(key) {
                    output += "\n" + key + delimiter + "r" + delimiter + "p" + delimiter + "n\n";
                    output += graphHolder.dataForCSVExport[key].join("\n") + "\n";
                })
                break;
            default:
                alert("No csv output has been implemented for the current graph selection.");
        }
        output = pattern.patternName + " (" + niceGraphTypeName + ")\n\n" + output;
        if (saveFile) {
            const exportBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
            saveAs(exportBlob, pattern.patternName + ".csv");
        } else {
            return output;
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
        const titleText = "Statistics for pattern: " +  this.currentPattern.patternName;
        const text = titleText + (this.graphHolder.statisticalInfo.indexOf("\n\n") !== 0 ? "\n\n" : "") + this.graphHolder.statisticalInfo;
        dialogSupport.openTextEditorDialog(text, titleText, "Close", "Copy to Clipboard", this.closeCopyStoriesDialogClicked.bind(this), false, true);
    }

    showSurveyQuestionsForPatternQuestions() {
        if (!this.currentPattern) {
            alert("Please choose a graph.");
            return;
        }
        if (!this.currentPattern.questions) {
            alert("The current pattern has no questions.");
            return;
        }       
        const titleText = "Questions for pattern: " +  this.currentPattern.patternName;
        const typesToExplanationsDict = {
            "select": "single choice",
            "radiobuttons": "single choice",
            "boolean": "yes/no",
            "checkbox": "yes/no",
            "checkboxes": "multiple choice",
            "slider": "scale",
            "text": "text",
            "textarea": "text",
        }
        let text = "";
        for (let question of this.currentPattern.questions) {
            if (question.displayName && question.displayType && question.displayPrompt) {
                text += question.displayName + " (" + typesToExplanationsDict[question.displayType] + "): " + question.displayPrompt + "\n";
                if (question.valueOptions) {
                    text += "    " + question.valueOptions.join("\n    ") + "\n";
                } else if (question.displayType === "slider" && question.displayConfiguration.length > 1) {
                    text += "    " + question.displayConfiguration[0] + " ----- " + question.displayConfiguration[1] + "\n";
                }
                text += "\n";
            }
        }
        dialogSupport.openTextEditorDialog(text, titleText, "Close", "Copy to Clipboard", this.closeCopyStoriesDialogClicked.bind(this), false, true);
    }

    showAllStoriesSelectedInGraph() {
        const stories = this.modelForStoryGrid.storiesSelectedInGraph;
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
        const stories = this.modelForStoryGrid.storiesSelectedInGraph;
        if (!stories.length) {
            alert("Please select some stories to show.");
            return;
        }
        let sampledStories = [];
        if (stories.length <= sampleSize) {
            sampledStories = sampledStories.concat(stories);
        } else {   
            const sampledStoryIDs = [];   
            while (sampledStoryIDs.length < sampleSize) { 
                const randomIndex = Math.max(0, Math.min(stories.length - 1, Math.round(Math.random() * stories.length) - 1));
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

    showStoriesInSeparateWindow(stories: Story[], sayAboutSelection, windowTitle) {
        let i;
        let text;
        const selectionName = this.nameForCurrentGraphSelection();

        let questionShortNames = this.project.tripleStore.queryLatestC(this.catalysisReportIdentifier, "questionShortNamesToShowForSelectedStories");
        if (questionShortNames === undefined) {
            questionShortNames = [];
        } else {
            if (typeof questionShortNames === "string") {
                questionShortNames = questionShortNames.split("\n"); 
            }
        } 

        const storyQuestions = this.project.storyQuestionsForCatalysisReport(this.catalysisReportIdentifier); 
        const participantQuestions = this.project.participantQuestionsForCatalysisReport(this.catalysisReportIdentifier);
        const annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        
        const questionIDsToShowForSelectedStories = [];
        questionShortNames.forEach(function(shortName) {
            for (let i = 0; i < storyQuestions.length; i++) {
                if (storyQuestions[i].id === "S_" + shortName) {
                    questionIDsToShowForSelectedStories.push("S_" + shortName);
                    break;
                }
            }
            for (let i = 0; i < participantQuestions.length; i++) {
                if (participantQuestions[i].id === "P_" + shortName) {
                    questionIDsToShowForSelectedStories.push("P_" + shortName);
                    break;
                }
            }
            for (let i = 0; i < annotationQuestions.length; i++) {
                if (annotationQuestions[i].id === "A_" + shortName) {
                    questionIDsToShowForSelectedStories.push("A_" + shortName);
                    break;
                }
            }
        });

        function textWithAnswersToSelectedQuestions(story) {
            const questionAnswersToShow = [];
            questionIDsToShowForSelectedStories.forEach(function(fieldName) {
                const answer = story.fieldValue(fieldName);
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
        for (let i = 0; i < stories.length; i++) {
            text += stories[i].indexInStoryCollection() + ". " + stories[i].storyName() + textWithAnswersToSelectedQuestions(stories[i]) + "\n";
        }

        // then full story texts
        text += "\nStories (" + stories.length + ") " + sayAboutSelection + " - " + selectionName + "\n";
        const header = "\n----------------------------------------------------------------------------------------------------\n";
        for (let i = 0; i < stories.length; i++) {
            text += "\n" + stories[i].indexInStoryCollection() + ". " + stories[i].storyName() + textWithAnswersToSelectedQuestions(stories[i]);
            if (this.numStoryCollectionsIncludedInReport > 1) text += "\nStory collection: " + stories[i].storyCollectionIdentifier();
            text += header + stories[i].storyText() + "\n";
        }

        dialogSupport.openTextEditorDialog(text, windowTitle, "Close", "Copy to Clipboard", this.closeCopyStoriesDialogClicked.bind(this), false, true);
    }

    closeCopyStoriesDialogClicked(text, hideDialogMethod) {     
        hideDialogMethod();
    }

    nameForCurrentGraphSelection() {
        let result = "";

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
        const textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_savedGraphSelections");
        const selection = this.graphHolder.currentSelectionExtentPercentages;
        const textToInsert = JSON.stringify(selection);
        
        // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const oldText = activeAccessor.observationSavedGraphSelections();
        const newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
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

        const textarea = <HTMLTextAreaElement>document.getElementById("observationPanel_savedGraphSelections");
        if (!this.currentPattern) return;
        const text = activeAccessor.observationSavedGraphSelections();

        if (doFocus) textarea.focus();

        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        
        // Find the text for a selection surrounding the current insertion point
        // This assumes there are not nested objects with nested braces
        let start;
        let end;
        
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
        // const selectedText = oldText.substring(selectionStart, selectionEnd);
        const selectedText = this.scanForSelectionJSON(true);
        if (!selectedText) {
            // TODO: Translate
            alert("To restore a graph selection, your cursor has to be inside the curly-brackets reference in a graph selections text box (which is part of an observation).\nClick inside the curly brackets, then try this again.");
            return;
        }
        
        let selection = null;
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
        
        let graph = this.graphHolder.currentGraph;
        if (_.isArray(graph)) {
            let optionText = selection.subgraphChoice;
            if (!optionText) {
                // TODO: Translate
                alert("No choice of sub-graph was specified in in the stored graph selection.");
                return;
            }
            optionText = decodeCurlyBraces(optionText);
            const graphs = this.graphHolder.currentGraph;
            graphs.forEach(function (subgraph) {
                if (subgraph.subgraphChoice === optionText) {
                    graph = subgraph;
                }
            });
        }
        
        charting.restoreChartSelection(graph, selection);
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    // observations and interpretations
    //------------------------------------------------------------------------------------------------------------------------------------------

    // We don't make the set when the report is created; lazily make it if needed now
    getObservationSetIdentifier(catalysisReportIdentifier) {
        if (!catalysisReportIdentifier) {
            throw new Error("getObservationSetIdentifier: catalysisReportIdentifier is not defined"); 
        }
        let setIdentifier = this.project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
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

    constructor( public observationID: string ) { }

    getOrSetField(field: string, newValue = undefined) {
        const project = Globals.project();
        if (newValue === undefined) {
            let result = project.tripleStore.queryLatestC(this.observationID, field);
            if (result === undefined || result === null) {
                result = "";
            }
            return result;
        } else {
            project.tripleStore.addTriple(this.observationID, field, newValue);
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

    observationNote(newValue = undefined) {
        return this.getOrSetField("observationNote", newValue);
    }

    observationInterpretations(newValue = undefined) {
        return this.getOrSetField("observationInterpretations", newValue);
    }
}

export = PatternExplorer;
