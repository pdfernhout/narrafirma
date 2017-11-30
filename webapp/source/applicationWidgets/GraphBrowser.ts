import charting = require("./charting");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
// import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import Globals = require("../Globals");
import m = require("mithril");

"use strict";

function questionForID(questions, id) {
    if (!id) return null;
    for (var index in questions) {
        var question = questions[index];
        if (question.id === id) return question;
    }
    console.log("ERROR: question not found for id", id, questions);
    return null;
}

class GraphBrowser {
    project: Project = null;
    xAxisSelectValue = null;
    yAxisSelectValue = null;
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
            minimumStoryCountRequiredForTest: Project.defaultMinimumStoryCountRequiredForTest,
            numHistogramBins: Project.defaultNumHistogramBins,
            numScatterDotOpacityLevels: Project.defaultNumScatterDotOpacityLevels,
            scatterDotSize: Project.defaultScatterDotSize,
            correlationLineChoice: null,
            graphTypesToCreate: {}
        }; 
    }
    
    static controller(args) {
        return new GraphBrowser(args);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    // TODO: Translate
    
    // TODO: Track new incoming stories
    
    calculateView(args) {
        // Handling of caching of questions and stories
        var storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            // TODO: Maybe need to handle tracking if list changed so can keep sorted list?
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            this.currentStoryCollectionChanged(this.storyCollectionIdentifier);
        }
        
        var parts;
        
        if (!this.storyCollectionIdentifier) {
            parts = [m("div", "Please select a story collection to view")];
        } else {
            parts = [
                m("select.graphBrowserSelect", {onchange: (event) => { this.xAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.xAxisSelectValue)),
                " versus ",
                m("select.graphBrowserSelect", {onchange: (event) => { this.yAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.yAxisSelectValue)),
                m("br"),
                m("div", {config: this.insertGraphResultsPaneConfig.bind(this)}),
                m("div.narrafirma-graphbrowser-heading", "Selected stories (" + this.selectedStories.length + ")"),
                this.selectedStories.map((story) => {
                    return m("div", [
                        m("b", story.storyName()),
                        m("br"),
                        m("blockquote", story.storyText())
                    ]);
                })
            ];
        }
        
        // TODO: Need to set class
        return m("div", parts);
        
        /*
        // TODO: Should provide copy of item?
        var panelBuilder: PanelBuilder = args.panelBuilder;
        // Possible recursion if the panels contain a table
        
        var theClass = "narrafirma-griditempanel-viewing";
        if (args.mode === "edit") {
            theClass = "narrafirma-griditempanel-editing";  
        }
        return m("div", {"class": theClass}, panelBuilder.buildPanel(args.grid.itemPanelSpecification, args.item));
        */
    }
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
    }
    
    storiesSelected(selectedStories) {
        // TODO: Finish
        this.selectedStories = selectedStories;
    }
    
    calculateOptionsForChoices(currentValue) {
        var options = this.choices.map((option) => {
            var optionOptions = {value: option.value, selected: undefined};
            if (currentValue === option.value) optionOptions.selected = 'selected';
            return m("option", optionOptions, option.label);
        });
        var hasNoSelection = (currentValue === null || currentValue === undefined || currentValue === "") || undefined;
        options.unshift(m("option", {value: "", selected: hasNoSelection}, "--- select ---"));
        return options;
    }
    
    currentStoryCollectionChanged(storyCollectionIdentifier) {
        this.questions = [];
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        
        var elicitingQuestion = this.project.elicitingQuestionForStoryCollection(this.storyCollectionIdentifier);
        if (elicitingQuestion) this.questions.push(elicitingQuestion);
        var numStoriesToldQuestions = this.project.numStoriesToldQuestionForStoryCollection(this.storyCollectionIdentifier);

        var storyQuestions = this.project.storyQuestionsForStoryCollection(this.storyCollectionIdentifier);
        var participantQuestions = this.project.participantQuestionsForStoryCollection(this.storyCollectionIdentifier);
        // annotations are not per collection/questionnaire
        var annotationQuestions = questionnaireGeneration.convertEditorQuestions(this.project.collectAllAnnotationQuestions(), "A_");
        
        this.questions = this.questions.concat(storyQuestions, participantQuestions, annotationQuestions, numStoriesToldQuestions);

        this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");
        // update all stories for the specific collection and update graph
        this.loadLatestStories();
    }
    
    loadLatestStories() {
        this.graphHolder.allStories = surveyCollection.getStoriesForStoryCollection(this.storyCollectionIdentifier);
        this.updateGraph();
    }
    
    updateGraph() {
        var xAxisQuestionID = this.xAxisSelectValue;
        var yAxisQuestionID = this.yAxisSelectValue;
        
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
        
        this.selectedStories = [];
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return; // alert("Please select a question for one or both graph axes");
          
        var xAxisQuestion = questionForID(this.questions, xAxisQuestionID);
        var yAxisQuestion = questionForID(this.questions, yAxisQuestionID);
        
        // Ensure xAxisQuestion is always defined
        if (!xAxisQuestion) {
            xAxisQuestion = yAxisQuestion;
            yAxisQuestion = null;
        }
        
        if (!xAxisQuestion) return;
        
        var xType = "choice";
        var yType = null;
        if (xAxisQuestion.displayType === "slider") {
            xType = "scale";
        }
        if (yAxisQuestion) {
            if (yAxisQuestion.displayType === "slider") {
                yType = "scale";
            } else {
                yType = "choice";
            }
        }
        
        if (xType === "choice" && yType === null) {
            charting.d3BarChartForQuestion(this.graphHolder, xAxisQuestion, this.storiesSelected.bind(this), true);
        } else if (xType === "choice" && yType === "choice") {
            charting.d3ContingencyTable(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "choice" && yType === "scale") {
            charting.multipleHistograms(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === null) {
            charting.d3HistogramChartForQuestion(this.graphHolder, xAxisQuestion, null, null, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === "choice") {
            charting.multipleHistograms(this.graphHolder, yAxisQuestion, xAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === "scale") {
            charting.d3ScatterPlot(this.graphHolder, xAxisQuestion, yAxisQuestion, null, null, this.storiesSelected.bind(this));
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
}

export = GraphBrowser;
