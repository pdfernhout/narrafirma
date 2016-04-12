import charting = require("./charting");
import questionnaireGeneration = require("../questionnaireGeneration");
import surveyCollection = require("../surveyCollection");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
// import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
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
    xAxisSelectValue = null;
    yAxisSelectValue = null;
    questions = [];
    choices = [];
    storyCollectionIdentifier: string = null;
    selectedStories = [];
    
    graphHolder: GraphHolder;
    
    constructor(args) {
        this.graphHolder = {
            graphResultsPane: charting.createGraphResultsPane("narrafirma-graph-results-pane"),
            chartPanes: [],
            allStories: [],
            currentGraph: null,
            currentSelectionExtentPercentages: null,
            minimumStoryCountRequiredForTest: Project.defaultMinimumStoryCountRequiredForTest
        }; 
    }
    
    static controller(args) {
        // console.log("Making GraphBrowser: ", args);
        return new GraphBrowser(args);
    }
    
    static view(controller, args) {
        // console.log("GraphBrowser view called");
        
        return controller.calculateView(args);
    }
    
    // TODO: Translate
    
    // TODO: Track new incoming stories
    
    calculateView(args) {
        // console.log("GraphBrowser view called", this);

        // Handling of caching of questions and stories
        var storyCollectionIdentifier = valuePathResolver.newValuePathForFieldSpecification(args.model, args.fieldSpecification)();
        
        if (storyCollectionIdentifier !== this.storyCollectionIdentifier) {
            // TODO: Maybe need to handle tracking if list changed so can keep sorted list?
            this.storyCollectionIdentifier = storyCollectionIdentifier;
            // console.log("storyCollectionIdentifier changed", this.storyCollectionIdentifier);
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
                    // console.log("story", story);
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
        // console.log("Stories selected", selectedStories);
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
        this.storyCollectionIdentifier = storyCollectionIdentifier;
        
        // Update selects for new question choices
        this.questions = questionnaireGeneration.collectAllQuestions();
        // console.log("----------- questions", this.questions);
        
        this.choices = surveyCollection.optionsForAllQuestions(this.questions, "excludeTextQuestions");

        // update all stories for the specific collection and update graph
        this.loadLatestStories();
    }
    
    loadLatestStories() {
        // console.log("loadLatestStories", this);
        
        this.graphHolder.allStories = surveyCollection.getStoriesForStoryCollection(this.storyCollectionIdentifier);
        // console.log("allStories", this.graphHolder.allStories);
    
        this.updateGraph();
    }
    
    updateGraph() {
        // console.log("updateGraph", this);

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
        
        // console.log("x y axis values", xAxisQuestion, yAxisQuestion);
        
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
        
        // console.log("types x y", xType, yType);
         
        if (xType === "choice" && yType === null) {
            // console.log("plot choice: Bar graph");
            // console.log("barGraph", xAxisQuestion);
            charting.d3BarChart(this.graphHolder, xAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "choice" && yType === "choice") {
            // console.log("plot choice: Contingency table");
            charting.d3ContingencyTable(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "choice" && yType === "scale") {
            // console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === null) {
            // console.log("plot choice: Histogram");
            charting.d3HistogramChart(this.graphHolder, xAxisQuestion, null, null, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === "choice") {
            // console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this.graphHolder, yAxisQuestion, xAxisQuestion, this.storiesSelected.bind(this));
        } else if (xType === "scale" && yType === "scale") {
            // console.log("plot choice: Scatter plot");
            charting.d3ScatterPlot(this.graphHolder, xAxisQuestion, yAxisQuestion, this.storiesSelected.bind(this));
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
}

export = GraphBrowser;
