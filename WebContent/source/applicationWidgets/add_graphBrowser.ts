import charting = require("./charting");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
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

function storiesSelected(graphBrowserInstance, selectedStories) {
    // TODO: Finish
    console.log("Stories selected", selectedStories);
}

// TODO: duplicate code copied from add_storyBrowser.ts
function getCurrentStoryCollectionIdentifier(args) {
    var panelBuilder = args.panelBuilder;
    var model = args.model;
    var fieldSpecification = args.fieldSpecification;
    
    // Get questionnaire for selected story collection
    // TODO: What if the value is an array of stories to display directly?
    var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
    console.log("choiceModelAndField", choiceModelAndField);
    var choiceModel = choiceModelAndField.model;
    var choiceField = choiceModelAndField.field; 
    var storyCollectionIdentifier = choiceModel[choiceField];
    
    return storyCollectionIdentifier;
}

function createGraphResultsPane(): HTMLElement {
    var pane = document.createElement("div");
    pane.className = "narrafirma-graph-results-pane";
    return pane;
}

class GraphBrowser {
    xAxisSelectValue = null;
    yAxisSelectValue = null;
    questions = [];
    choices = [];
    currentQuestionnaire = null;
    storyCollectionIdentifier: string = null;
    
    graphHolder: GraphHolder;
    
    constructor() {
        this.graphHolder = {
            graphResultsPane: createGraphResultsPane(),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null
        };
    }
    
    static controller(args) {
        console.log("Making GraphBrowser: ", args);
        return new GraphBrowser();
    }
    
    static view(controller, args) {
        console.log("GraphBrowser view called");
        
        return controller.calculateView(args);
    }
    
    // TODO: Translate
    
    // TODO: Track new incoming stories
    
    calculateView(args) {
        console.log("%%%%%%%%%%%%%%%%%%% GraphBrowser view called", this);

        // TODO: Need to track currentQuestionnaire?
        
        // TODO: Probably need to handle tracking if list changed so can keep sorted list...
        this.storyCollectionIdentifier = getCurrentStoryCollectionIdentifier(args);
        console.log("storyCollectionIdentifier", this.storyCollectionIdentifier);
        
        if (!this.storyCollectionIdentifier) {
            return m("div", "Please select a story collection to view");
        }
        
        // Set up initial data
        this.currentStoryCollectionChanged(this.storyCollectionIdentifier);

        // title: "Graph results",
        
        this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");
        
        return m("div", [
            m("select.graphBrowserSelect", {onchange: (event) => { this.xAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.xAxisSelectValue)),
            " versus ",
            m("select.graphBrowserSelect", {onchange: (event) => { this.yAxisSelectValue = event.target.value; this.updateGraph(); }}, this.calculateOptionsForChoices(this.yAxisSelectValue)),
            m("br"),
            m("div", {config: this.insertGraphResultsPaneConfig.bind(this)})
        ]);
        
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
    
    insertGraphResultsPaneConfig(element: HTMLElement, isInitialized: boolean, context: any, vdom: _mithril.MithrilVirtualElement) {
        if (!isInitialized) {
            element.appendChild(this.graphHolder.graphResultsPane);
        }       
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
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        
        this.currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        console.log("graphBrowserInstance.currentQuestionnaire", this.currentQuestionnaire);
        
        // Update selects for new question choices
        this.questions = surveyCollection.collectQuestionsForQuestionnaire(this.currentQuestionnaire);
        console.log("----------- questions", this.questions);
        
        this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");

        // update all stories for the specific collection and update graph
        this.loadLatestStories();
    }
    
    loadLatestStories() {
        console.log("loadLatestStories", this);
        
        this.graphHolder.allStories = surveyCollection.getStoriesForStoryCollection(this.storyCollectionIdentifier);
        console.log("allStories", this.graphHolder.allStories);
    
        this.updateGraph();
    }
    
    updateGraph() {
        console.log("updateGraph", this);

        var xAxisQuestionID = this.xAxisSelectValue;
        var yAxisQuestionID = this.yAxisSelectValue;
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return; // alert("Please select a question for one or both graph axes");
        
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
         
        var xAxisQuestion = questionForID(this.questions, xAxisQuestionID);
        var yAxisQuestion = questionForID(this.questions, yAxisQuestionID);
        
        // Ensure xAxisQuestion is always defined
        if (!xAxisQuestion) {
            xAxisQuestion = yAxisQuestion;
            yAxisQuestion = null;
        }
        
        console.log("x y axis values", xAxisQuestion, yAxisQuestion);
        
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
        
        console.log("types x y", xType, yType);
         
        if (xType === "choice" && yType === null) {
            console.log("plot choice: Bar graph");
            console.log("barGraph", xAxisQuestion);
            charting.d3BarChart(this.graphHolder, xAxisQuestion, storiesSelected);
        } else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            charting.d3ContingencyTable(this.graphHolder, xAxisQuestion, yAxisQuestion, storiesSelected);
        } else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this.graphHolder, xAxisQuestion, yAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            charting.d3HistogramChart(this.graphHolder, null, null, xAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this.graphHolder, yAxisQuestion, xAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            charting.d3ScatterPlot(this.graphHolder, xAxisQuestion, yAxisQuestion, storiesSelected);
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
}

function add_graphBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var graphBrowser = m.component(<any>GraphBrowser, {panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification});
    // insertGraphBrowser(panelBuilder, model, fieldSpecification);

    return m("div", [
        prompt,
        graphBrowser
     ]);
}

export = add_graphBrowser;
