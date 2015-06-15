define(["require", "exports", "./charting", "js/surveyCollection", "js/panelBuilder/widgetSupport", "dijit/layout/ContentPane", "js/panelBuilder/valuePathResolver"], function (require, exports, charting, surveyCollection, widgetSupport, ContentPane, valuePathResolver) {
    "use strict";
    function questionForID(questions, id) {
        if (!id)
            return null;
        for (var index in questions) {
            var question = questions[index];
            if (question.id === id)
                return question;
        }
        console.log("ERROR: question not found for id", id, questions);
        return null;
    }
    function updateGraph(graphBrowserInstance) {
        console.log("updateGraph", graphBrowserInstance);
        var xAxisQuestionID = graphBrowserInstance.xAxisSelect.get("value");
        var yAxisQuestionID = graphBrowserInstance.yAxisSelect.get("value");
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID)
            return; // alert("Please select a question for one or both graph axes");
        while (graphBrowserInstance.chartPanes.length) {
            var chartPane = graphBrowserInstance.chartPanes.pop();
            chartPane.destroyRecursive(false);
        }
        var xAxisQuestion = questionForID(graphBrowserInstance.questions, xAxisQuestionID);
        var yAxisQuestion = questionForID(graphBrowserInstance.questions, yAxisQuestionID);
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
            }
            else {
                yType = "choice";
            }
        }
        console.log("types x y", xType, yType);
        if (xType === "choice" && yType === null) {
            console.log("plot choice: Bar graph");
            console.log("barGraph", xAxisQuestion);
            charting.d3BarChart(graphBrowserInstance, xAxisQuestion);
        }
        else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            charting.d3ContingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        }
        else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        }
        else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            charting.d3HistogramChart(graphBrowserInstance, xAxisQuestion);
        }
        else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            charting.multipleHistograms(graphBrowserInstance, yAxisQuestion, xAxisQuestion);
        }
        else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            charting.d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        }
        else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }
    }
    function currentStoryCollectionChanged(graphBrowserInstance, fieldName, oldValue, storyCollectionIdentifier) {
        graphBrowserInstance.storyCollectionIdentifier = storyCollectionIdentifier;
        graphBrowserInstance.currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
        console.log("graphBrowserInstance.currentQuestionnaire", graphBrowserInstance.currentQuestionnaire);
        // Update selects for new question choices
        var questions = surveyCollection.collectQuestionsForQuestionnaire(graphBrowserInstance.currentQuestionnaire);
        console.log("----------- questions", questions);
        graphBrowserInstance.questions = questions;
        var choices = surveyCollection.optionsForAllQuestions(questions, "excludeTextQuestions");
        widgetSupport.updateSelectChoices(graphBrowserInstance.xAxisSelect, choices);
        widgetSupport.updateSelectChoices(graphBrowserInstance.yAxisSelect, choices);
        // update all stories for the specific collection and update graph
        loadLatestStories(graphBrowserInstance);
    }
    function loadLatestStories(graphBrowserInstance) {
        console.log("loadLatestStories", graphBrowserInstance);
        graphBrowserInstance.allStories = surveyCollection.getStoriesForStoryCollection(graphBrowserInstance.storyCollectionIdentifier);
        console.log("allStories", graphBrowserInstance.allStories);
        updateGraph(graphBrowserInstance);
    }
    function insertGraphBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var choices = [];
        var xAxisSelect = widgetSupport.newSelect(contentPane, choices);
        xAxisSelect.set("style", "width: 48%; max-width: 40%");
        // TODO: Translate
        var content = new ContentPane({ content: " versus ", style: "display: inline;" });
        contentPane.addChild(content);
        var yAxisSelect = widgetSupport.newSelect(contentPane, choices);
        yAxisSelect.set("style", "width: 48%; max-width: 40%");
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results",
            class: "narrafirma-graph-results-pane"
        });
        var choiceModelAndField = valuePathResolver.resolveModelAndFieldForFieldSpecification(panelBuilder, model, fieldSpecification);
        console.log("choiceModelAndField", choiceModelAndField);
        var choiceModel = choiceModelAndField.model;
        var choiceField = choiceModelAndField.field;
        var storyCollectionIdentifier = choiceModel.get(choiceField);
        var graphBrowserInstance = {
            graphResultsPane: graphResultsPane,
            chartPanes: [],
            xAxisSelect: xAxisSelect,
            yAxisSelect: yAxisSelect,
            questions: [],
            storyCollectionIdentifier: storyCollectionIdentifier,
            currentQuestionnaire: null,
            allStories: []
        };
        var currentQuestionnaireSubscription = choiceModel.watch(choiceField, currentStoryCollectionChanged.bind(null, graphBrowserInstance));
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        contentPane.own(currentQuestionnaireSubscription);
        xAxisSelect.on("change", updateGraph.bind(null, graphBrowserInstance));
        yAxisSelect.on("change", updateGraph.bind(null, graphBrowserInstance));
        // var updateGraphButton = widgetSupport.newButton(contentPane, "#updateGraph|Update graph", updateGraph.bind(null, graphBrowserInstance));
        contentPane.containerNode.appendChild(document.createElement("br"));
        contentPane.containerNode.appendChild(document.createElement("br"));
        contentPane.addChild(graphResultsPane);
        // TODO: Track new incoming stories
        // Set up initial data
        currentStoryCollectionChanged(graphBrowserInstance, null, null, storyCollectionIdentifier);
        return graphResultsPane;
    }
    function add_graphBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var graphBrowserInstance = insertGraphBrowser(panelBuilder, questionContentPane, model, fieldSpecification);
        questionContentPane.resize();
        return graphBrowserInstance;
    }
    return add_graphBrowser;
});
