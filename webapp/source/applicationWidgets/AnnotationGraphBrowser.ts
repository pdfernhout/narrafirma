import charting = require("./charting");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");

"use strict";

function questionForID(questions, id) {
    if (!id) return null;
    for (let index in questions) {
        const question = questions[index];
        if (question.id === id) return question;
    }
    console.log("ERROR: question not found for id", id, questions);
    return null;
}

class AnnotationGraphBrowser {
    project: Project = null;
    selectValue = null;
    questions = [];
    choices = [];
    storyCollectionIdentifier: string = null;
    selectedStories = [];
    
    graphHolder: GraphHolder;
    
    constructor(args) {
        this.project = Globals.project();
        this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            minimumStoryCountRequiredForTest: Project.default_minimumStoryCountRequiredForTest,
            minimumStoryCountRequiredForGraph: 0,
            numHistogramBins: Project.default_numHistogramBins,
            numScatterDotOpacityLevels: Project.default_numScatterDotOpacityLevels,
            scatterDotSize: Project.default_scatterDotSize,
            correlationMapShape: Project.default_correlationMapShape,
            correlationMapIncludeScaleEndLabels: Project.default_correlationMapIncludeScaleEndLabels,
            correlationMapCircleDiameter: Project.default_correlationMapCircleDiameter,
            correlationLineChoice: Project.default_correlationLineChoice,
            customLabelLengthLimit: Project.default_customLabelLengthLimit,
            customGraphWidth: 600,
            customGraphPadding: 0,
            hideNumbersOnContingencyGraphs: false,
            patternDisplayConfiguration: {hideNoAnswerValues: true},
            graphTypesToCreate: {},
            lumpingCommands: {}
        }; 
    }
    
    static controller(args) {
        return new AnnotationGraphBrowser(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // Handling of caching of questions and stories
        const storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            // TODO: Maybe need to handle tracking if list changed so can keep sorted list?
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
        }

        this.updateGraph();
        
        let parts;
        
        if (this.storyCollectionIdentifier) {
            parts = [
                m("select.narrafirma-annotation-counts-graph-select", {onchange: (event) => { this.selectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.selectValue)),
                m("div.narrafirma-annotation-counts-graph", {config: this.insertGraphResultsPaneConfig.bind(this)})
            ];
        }
        
        return m("div", parts);
     }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    storiesSelected(selectedStories) {
        this.selectedStories = selectedStories;
    }
    
    calculateOptionsForChoices(currentValue) {
        const options = this.choices.map((option) => {
            const optionOptions = {value: option.value, selected: undefined};
            if (currentValue === option.value) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        const hasNoSelection = (currentValue === null || currentValue === undefined || currentValue === "") || undefined;
        options.unshift(m("option", {value: "", selected: hasNoSelection}, "--- select ---"));
        return options;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        this.questions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");
        this.loadLatestStories();
    }
    
    loadLatestStories() {
        this.graphHolder.allStories = surveyCollection.getStoriesForStoryCollection(this.storyCollectionIdentifier);
        this.updateGraph();
    }
    
    updateGraph() {
        const questionID = this.selectValue;
        
        // Remove old graph(s)
        while (this.graphHolder.chartPanes.length) {
            const chartPane = this.graphHolder.chartPanes.pop();
            this.graphHolder.graphResultsPane.removeChild(chartPane);
        }
        
        // Need to remove the float end node, if any        
        while (this.graphHolder.graphResultsPane.firstChild) {
            this.graphHolder.graphResultsPane.removeChild(this.graphHolder.graphResultsPane.firstChild);
        }
        
        this.selectedStories = [];
        
        if (!questionID) return; 
        const question = questionForID(this.questions, questionID);
        if (!question) return;
        
        let type = "choice";
        if (question.displayType === "slider") type = "scale";
        
        if (type === "choice") {
            charting.d3BarChartForQuestion(this.graphHolder, question, this.storiesSelected.bind(this), true);
        } else if (type === "scale") {
            charting.d3HistogramChartForQuestion(this.graphHolder, question, null, null, this.storiesSelected.bind(this), true);
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
}

export = AnnotationGraphBrowser;
