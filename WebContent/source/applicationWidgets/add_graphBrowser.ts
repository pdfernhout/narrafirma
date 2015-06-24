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

function insertGraphBrowser(panelBuilder: PanelBuilder, model, fieldSpecification) {       
    var currentQuestionnaireSubscription = choiceModel.watch(choiceField, currentStoryCollectionChanged.bind(null, graphBrowserInstance));        
    // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
    contentPane.own(currentQuestionnaireSubscription);
    
    xAxisSelect.on("change", updateGraph.bind(null, graphBrowserInstance));  
    yAxisSelect.on("change", updateGraph.bind(null, graphBrowserInstance));
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

/*
// TODO: duplicate code copied from add_storyBrowser.ts
function getQuestionDataForSelection(questions, event) {
    var newValue = event.target.value;
     
    var question = null;
    
    for (var index = 0; index < questions.length; index++) {
        var questionToCheck = questions[index];
        if (questionToCheck.id === newValue) {
            question = questionToCheck;
            break;
        }
    }
    
    //console.log("filterPaneQuestionChoiceChanged", question);
    
    if (!question && newValue) console.log("could not find question for id", newValue);
    
    return question; 
}
*/

class GraphBrowser {
    xAxisSelectValue = null;
    yAxisSelectValue = null;
    questions = [];
    choices = [];
    allStories = [];
    currentQuestionnaire = null;
    storyCollectionIdentifier: string = null;
    chartPanes = [];
    
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
            m("div.narrafirma-graph-results-pane", this.chartPanes)
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
        // TODO: this.loadLatestStories();
    }
    
    loadLatestStories() {
        console.log("loadLatestStories", this);
        
        this.allStories = surveyCollection.getStoriesForStoryCollection(this.storyCollectionIdentifier);
        console.log("allStories", this.allStories);
    
        this.updateGraph();
    }
    
    updateGraph() {
        console.log("updateGraph", this);
        
        var xAxisQuestionID = this.xAxisSelectValue;
        var yAxisQuestionID = this.yAxisSelectValue;
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return; // alert("Please select a question for one or both graph axes");
        
        // Remove old graph(s)
        while (this.chartPanes.length) {
            var chartPane = this.chartPanes.pop();
            chartPane.destroyRecursive(false);
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
            charting.d3BarChart(this, xAxisQuestion, storiesSelected);
        } else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            charting.d3ContingencyTable(this, xAxisQuestion, yAxisQuestion, storiesSelected);
        } else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this, xAxisQuestion, yAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            charting.d3HistogramChart(this, null, null, xAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(this, yAxisQuestion, xAxisQuestion, storiesSelected);
        } else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            charting.d3ScatterPlot(this, xAxisQuestion, yAxisQuestion, storiesSelected);
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
