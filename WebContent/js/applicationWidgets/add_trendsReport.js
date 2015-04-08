define([
    "dojo/_base/array",
    "dijit/layout/BorderContainer",
    "./charting",
    "dijit/layout/ContentPane",
    "js/domain",
    "js/panelBuilder/standardWidgets/GridWithItemPanel",
    "js/storyCardDisplay",
    "js/surveyCollection"
], function(
    array,
    BorderContainer,
    charting,
    ContentPane,
    domain,
    GridWithItemPanel,
    storyCardDisplay,
    surveyCollection
){
    "use strict";
    
    // TODO: Duplicate style code of add_graphBrowser
    var chartEnclosureStyle = "width: 850px; height: 650px; margin: 5px auto 0px auto;";
    
    // Types of questions that have data associated with them for filters and graphs
    var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

    // TODO: Duplicate code for this function copied from charting
    function nameForQuestion(question) {
        if (question.displayName) return question.displayName;
        if (question.displayPrompt) return question.displayPrompt;
        return question.id;
    }
    
    function buildPatternList(graphBrowserInstance) {
        var result = [];
        var nominalQuestions = [];
        var ratioQuestions = [];
        
        // TODO: create all supported graphable permutations of questions
        array.forEach(graphBrowserInstance.questions, function (question) {
            if (question.displayType === "slider") {
                ratioQuestions.push(question);
            } else if (array.indexOf(nominalQuestionTypes, question.displayType) !== -1)  {
                nominalQuestions.push(question);
            }
        });
        
        var questionCount = 0;
        function nextID() {
            return "" + questionCount++;
        }
     
        nominalQuestions.forEach(function (question1) {
            result.push({id: nextID(), graphType: "bar", patternName: nameForQuestion(question1) + " (C)", questions: [question1]});
        });
        
        // Prevent mirror duplicates and self-matching questions
        var usedQuestions;
        
        usedQuestions = [];
        nominalQuestions.forEach(function (question1) {
            usedQuestions.push(question1);
            nominalQuestions.forEach(function (question2) {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push({id: nextID(), graphType: "table", patternName: nameForQuestion(question1) + " (C) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        ratioQuestions.forEach(function (question1) {
            result.push({id: nextID(), graphType: "histogram", patternName: nameForQuestion(question1) + " (S)", questions: [question1]});
        });
        
        ratioQuestions.forEach(function (question1) {
            nominalQuestions.forEach(function (question2) {
                result.push({id: nextID(), graphType: "multiple histogram", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        usedQuestions = [];
        ratioQuestions.forEach(function (question1) {
            usedQuestions.push(question1);
            ratioQuestions.forEach(function (question2) {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push({id: nextID(), graphType: "scatter", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (S)", questions: [question1, question2]});
            });
        });
        
        /* TODO: For later
        ratioQuestions.forEach(function (question1) {
            ratioQuestions.forEach(function (question2) {
                nominalQuestions.forEach(function (question3) {
                    result.push({id: nextID(), graphType: "multiple scatter", patternName: nameForQuestion(question1) + " (S)" + " vs. " + nameForQuestion(question2) + " (S) vs. " + nameForQuestion(question3) + " (C)", questions: [question1, question2, question3]});
                });
            });
        });
        */
        
        console.log("buildPatternsList", result);
        return result;
    }
    
    function chooseGraph(graphBrowserInstance, pattern) {
        console.log("chooseGraph", pattern);
        
        // Remove old graph(s)
        while (graphBrowserInstance.chartPanes.length) {
            var chartPane = graphBrowserInstance.chartPanes.pop();
            chartPane.destroyRecursive(false);
        }
        
        if (pattern === null) return;
        
        var name = pattern.patternName;
        var type = pattern.graphType;
        console.log("pattern", name, type);
        var q1 = pattern.questions[0];
        var q2 = pattern.questions[1];
        switch (type) {
            case "bar":
                charting.d3BarChart(graphBrowserInstance, q1, updateStoriesPane);
                break;
            case "table":
                charting.contingencyTable(graphBrowserInstance, q1, q2, updateStoriesPane);
                break;
            case "histogram":
                charting.d3HistogramChart(graphBrowserInstance, q1, null, null, updateStoriesPane);
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                charting.multipleHistograms(graphBrowserInstance, q2, q1, updateStoriesPane);
                break;
            case "scatter":
                charting.d3ScatterPlot(graphBrowserInstance, q1, q2, updateStoriesPane);
                break;        
           default:
                console.log("ERROR: Unexpected graph type");
                alert("ERROR: Unexpected graph type");
                break;
        }
    }
    
    function updateStoriesPane(graphBrowserInstance, stories) {
        graphBrowserInstance.selectedStories = stories;
        graphBrowserInstance.selectedStoriesStore.setData(stories);
        graphBrowserInstance.storyList.grid.set("collection", graphBrowserInstance.selectedStoriesStore);
    }

    // TODO: Next two functions from add_storyBrowser and so are duplicate code
    
    function buildStoryDisplayPanel(panelBuilder, contentPane, model) {
        var storyContent = storyCardDisplay.generateStoryCardContent(model, "includeElicitingQuestion");
        
        var storyPane = new ContentPane({
            content: storyContent           
        });
        storyPane.placeAt(contentPane);
    }
    
    function makeItemPanelSpecificationForQuestions(questions) {
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var storyItemPanelSpecification = {
             id: "storyBrowserQuestions",
             panelFields: questions,
             buildPanel: buildStoryDisplayPanel
        };
        
        return storyItemPanelSpecification;
    }

    function add_trendsReport(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);

        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results",
            style: chartEnclosureStyle,
            region: "bottom"
        });
        
        var graphBrowserInstance = {
            graphResultsPane: graphResultsPane,
            chartPanes: [], 
            questions: questions,
            allStories: domain.allStories,
            patterns: null,
            selectedStories: null,
            selectedStoriesStore: null, 
            storyList: null
        };
        
        var patterns = buildPatternList(graphBrowserInstance);
        
        graphBrowserInstance.patterns = patterns;
       
        var patternsListStore = GridWithItemPanel.newMemoryTrackableStore(patterns, "id");
        
        var patternsGridConfiguration = {navigationButtons: true, includeAllFields: true};
        patternsGridConfiguration.selectCallback = function (grid, item) {
            console.log("Select in grid", grid, item);
            chooseGraph(graphBrowserInstance, item);
        };
        
        var patternsPanelSpecification = {
            "id": "storyThemeQuestions",
            panelFields: [
                {id: "patternName", displayName: "Pattern name", dataOptions:[]},
                {id: "graphType", displayName: "Graph type", dataOptions:[]},
                {id: "significance", displayName: "Significance", dataOptions:[]},
                {id: "reviewed", displayName: "Reviewed", dataOptions:[]},
                {id: "observation", displayName: "Observation", dataOptions:[]}
            ]
        };
        
        // TODO: Splitter does not seem to work as expected; it has no height. This does not help: https://www.sitepen.com/blog/2013/05/02/dojo-faq-bordercontainer-not-visible/
        var splitterPane = new ContentPane(); // BorderContainer({style:'border:1px solid black'});
        contentPane.addChild(splitterPane);
        var gridContainerPane = new ContentPane({region: "center", splitter: true});
        splitterPane.addChild(gridContainerPane);
        splitterPane.addChild(graphResultsPane);
        splitterPane.startup();
        splitterPane.resize();
        
        var patternsGrid = new GridWithItemPanel(panelBuilder, gridContainerPane, "patternsList", patternsListStore, patternsPanelSpecification, patternsGridConfiguration);
        console.log("patternsGrid", patternsGrid);
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(questions);
        
        var selectedStories = [];
 
        // Store will modify underlying array
        var selectedStoriesStore = GridWithItemPanel.newMemoryTrackableStore(selectedStories, "_storyID");
        
        // Only allow view button for stories
        var configuration = {viewButton: true, navigationButtons: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        var storyList = new GridWithItemPanel(panelBuilder, contentPane, "storyGrid", selectedStoriesStore, storyItemPanelSpecification, configuration);
        storyList.grid.set("selectionMode", "single");       
        
        graphBrowserInstance.selectedStories = selectedStories;
        graphBrowserInstance.selectedStoriesStore = selectedStoriesStore;
        graphBrowserInstance.storyList = storyList;
        
        var observationPanelSpecification = {
            "id": "observationPanel",
            panelFields: [
                {id: "observation", displayName: "Observation", displayPrompt: "Add observation", displayType: "textarea", dataOptions:[]}
            ]
        };
        
        // TODO: Fix model as Stateful
        // TODO: Need to update model as pattern changes
        var observationModel = {};
        var observationPane = new ContentPane();
        contentPane.addChild(observationPane);
        panelBuilder.buildPanel(observationPanelSpecification, observationPane, observationModel);
        
        // TODO: Not sure what to return or if it matters
        return questionContentPane;
    }

    return add_trendsReport;
});