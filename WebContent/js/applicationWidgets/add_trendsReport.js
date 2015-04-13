define([
    "dojo/_base/array",
    "dijit/layout/BorderContainer",
    "./charting",
    "dijit/layout/ContentPane",
    "js/domain",
    "js/panelBuilder/standardWidgets/GridWithItemPanel",
    "dojo/_base/lang",
    "dojo/Stateful",
    "js/storyCardDisplay",
    "js/surveyCollection",
    "dojo/topic"
], function(
    array,
    BorderContainer,
    charting,
    ContentPane,
    domain,
    GridWithItemPanel,
    lang,
    Stateful,
    storyCardDisplay,
    surveyCollection,
    topic
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
            return ("00000" + questionCount++).slice(-5);
        }
     
        nominalQuestions.forEach(function (question1) {
            result.push({id: nextID(), observation: "", graphType: "bar", patternName: nameForQuestion(question1) + " (C)", questions: [question1]});
        });
        
        // Prevent mirror duplicates and self-matching questions
        var usedQuestions;
        
        usedQuestions = [];
        nominalQuestions.forEach(function (question1) {
            usedQuestions.push(question1);
            nominalQuestions.forEach(function (question2) {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push({id: nextID(), observation: "", graphType: "table", patternName: nameForQuestion(question1) + " (C) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        ratioQuestions.forEach(function (question1) {
            result.push({id: nextID(), observation: "", graphType: "histogram", patternName: nameForQuestion(question1) + " (S)", questions: [question1]});
        });
        
        ratioQuestions.forEach(function (question1) {
            nominalQuestions.forEach(function (question2) {
                result.push({id: nextID(), observation: "", graphType: "multiple histogram", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        usedQuestions = [];
        ratioQuestions.forEach(function (question1) {
            usedQuestions.push(question1);
            ratioQuestions.forEach(function (question2) {
                if (usedQuestions.indexOf(question2) !== -1) return;
                result.push({id: nextID(), observation: "", graphType: "scatter", patternName: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (S)", questions: [question1, question2]});
            });
        });
        
        /* TODO: For later
        ratioQuestions.forEach(function (question1) {
            ratioQuestions.forEach(function (question2) {
                nominalQuestions.forEach(function (question3) {
                    result.push({id: nextID(), observation: "", graphType: "multiple scatter", patternName: nameForQuestion(question1) + " (S)" + " vs. " + nameForQuestion(question2) + " (S) vs. " + nameForQuestion(question3) + " (C)", questions: [question1, question2, question3]});
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
        var currentGraph = null;
        switch (type) {
            case "bar":
                currentGraph = charting.d3BarChart(graphBrowserInstance, q1, updateStoriesPane);
                break;
            case "table":
                currentGraph = charting.contingencyTable(graphBrowserInstance, q1, q2, updateStoriesPane);
                break;
            case "histogram":
                currentGraph = charting.d3HistogramChart(graphBrowserInstance, q1, null, null, updateStoriesPane);
                break;
            case "multiple histogram":
                // Choice question needs to come before scale question in args
                currentGraph = charting.multipleHistograms(graphBrowserInstance, q2, q1, updateStoriesPane);
                break;
            case "scatter":
                currentGraph = charting.d3ScatterPlot(graphBrowserInstance, q1, q2, updateStoriesPane);
                break;        
           default:
                console.log("ERROR: Unexpected graph type");
                alert("ERROR: Unexpected graph type");
                break;
        }
        graphBrowserInstance.currentGraph = currentGraph;
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
    
    function currentQuestionnaireChanged(graphBrowserInstance, currentQuestionnaire) {
        // TODO: What to do about current selection in these widgets?
        
        // Deselect current pattern; could try to preserve selection
        patternSelected(graphBrowserInstance, graphBrowserInstance.patternsGrid, null);
        
        // TODO: Need to preserve old state with observations from patternList first... Except when starting up...
        if (graphBrowserInstance.patterns.length) {
            console.log("ERROR: Unfinished: TODO: Should be preserving existing observations here if not already saved???");
        }
        
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        graphBrowserInstance.questions = questions;
        
        var patterns = buildPatternList(graphBrowserInstance);
        graphBrowserInstance.patterns = patterns;
        graphBrowserInstance.patternsListStore.setData(patterns);
        graphBrowserInstance.patternsGrid.grid.set("collection", graphBrowserInstance.patternsListStore);
        
        // Update item panel in story list so it has the correct header
        var itemPanelSpecification = makeItemPanelSpecificationForQuestions(questions);
        graphBrowserInstance.storyList.changeItemPanelSpecification(itemPanelSpecification);
    }
    
    function loadLatestStoriesFromServerChanged(graphBrowserInstance, newEnvelopeCount, allStories) {
        if (!newEnvelopeCount) return;
        
        graphBrowserInstance.allStories = allStories;
        
        if (graphBrowserInstance.currentPattern) {
            chooseGraph(graphBrowserInstance, graphBrowserInstance.currentPattern);
        }
    }
    
    function patternSelected(graphBrowserInstance, grid, selectedPattern) {
        console.log("Select in grid", grid, selectedPattern);
        var observation;
        if (graphBrowserInstance.currentPattern) {
            // save observation
            observation = graphBrowserInstance.observationModel.get("observation");
            var oldObservation = graphBrowserInstance.currentPattern.observation || "";
            if (oldObservation !== observation) {
                graphBrowserInstance.currentPattern.observation = observation;
                graphBrowserInstance.patternsListStore.put(graphBrowserInstance.currentPattern);
            }
        }
        chooseGraph(graphBrowserInstance, selectedPattern);
        observation = "";
        if (selectedPattern) observation = selectedPattern.observation;
        graphBrowserInstance.observationModel.set("observation", observation);
        graphBrowserInstance.currentPattern = selectedPattern;
        
        graphBrowserInstance.selectedStories = [];
        graphBrowserInstance.selectedStoriesStore.setData(graphBrowserInstance.selectedStories);
        graphBrowserInstance.storyList.grid.set("collection", graphBrowserInstance.selectedStoriesStore);
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
            patternsListStore: null,
            patternsGrid: null,
            selectedStories: [],
            selectedStoriesStore: null, 
            storyList: null,
            observationModel: new Stateful({observation: ""}),
            currentPattern: null,
            currentGraph: null
        };
        
        var patterns = buildPatternList(graphBrowserInstance);
        graphBrowserInstance.patterns = patterns;
       
        var patternsListStore = GridWithItemPanel.newMemoryTrackableStore(patterns, "id");
        graphBrowserInstance.patternsListStore = patternsListStore;
        
        var patternsGridConfiguration = {navigationButtons: true, includeAllFields: true};
        patternsGridConfiguration.selectCallback = lang.partial(patternSelected, graphBrowserInstance);
        
        var patternsPanelSpecification = {
            "id": "storyThemeQuestions",
            panelFields: [
                {id: "id", displayName: "Index"},
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
        graphBrowserInstance.patternsGrid = patternsGrid;
        
        var storyItemPanelSpecification = makeItemPanelSpecificationForQuestions(questions);
 
        // Store will modify underlying array
        var selectedStoriesStore = GridWithItemPanel.newMemoryTrackableStore(graphBrowserInstance.selectedStories, "_storyID");
        graphBrowserInstance.selectedStoriesStore = selectedStoriesStore;
        
        // Only allow view button for stories
        var configuration = {viewButton: true, navigationButtons: true, includeAllFields: ["__survey_storyName", "__survey_storyText"]};
        var storyList = new GridWithItemPanel(panelBuilder, contentPane, "storyGrid", selectedStoriesStore, storyItemPanelSpecification, configuration);
        storyList.grid.set("selectionMode", "single");
        graphBrowserInstance.storyList = storyList;
        
        var observationPanelSpecification = {
            "id": "observationPanel",
            panelFields: [        
                {id: "insertGraphSelection", displayPrompt: "Insert graph selection", displayType: "button", displayConfiguration: insertGraphSelection},
                {id: "resetGraphSelection", displayPrompt: "Reset graph selection using saved selection chosen in observation", displayType: "button", displayConfiguration: resetGraphSelection},
                {id: "observation", displayName: "Observation", displayPrompt: "Add observation", displayType: "textarea"}
            ]
        };
        
        // var observationPane = new ContentPane();
        // contentPane.addChild(observationPane);
        var widgets = panelBuilder.buildPanel(observationPanelSpecification, contentPane, graphBrowserInstance.observationModel);
        
        // TODO: selections should be stored in original domain units, not scaled display units
        // TODO: Consolidate duplicate code from these two functions
        
        function insertGraphSelection() {
            if (!graphBrowserInstance.currentGraph) {
                // TODO: Translated
                alert("Please select a pattern first");
                return;
            }
            
            console.log("graphBrowserInstance.currentGraph", graphBrowserInstance.currentGraph);
            
            // Find observation textarea and other needed data
            var observationTextarea = widgets.observation;
            var textModel = graphBrowserInstance.observationModel;
            var textToInsert = "";
            if (_.isArray(graphBrowserInstance.currentGraph)) {
                textToInsert += '{ "selection": [ ';
                var first = true;
                graphBrowserInstance.currentGraph.forEach(function (subchart) {
                    if (!first) textToInsert += ', ';
                    textToInsert += JSON.stringify(subchart.brush.brush.extent());
                    first = false;
                });
                textToInsert += '] }';
            } else {
                textToInsert = '{ "selection": ' + JSON.stringify(graphBrowserInstance.currentGraph.brush.brush.extent()) + '  }';
            }
            
            // Replace the currently selected text in the textarea (or insert at caret if nothing selected)
            var textarea = observationTextarea.textbox;
            var selectionStart = textarea.selectionStart;
            var selectionEnd = textarea.selectionEnd;
            var oldText = textModel.get("observation");
            var newText = oldText.substring(0, selectionStart) + textToInsert + oldText.substring(selectionEnd);
            textModel.set("observation", newText);
            textarea.selectionStart = selectionStart;
            textarea.selectionEnd = selectionStart + textToInsert.length;
            textarea.focus();
        }
        
        function scanForSelectionJSON(text, selectionStart, selectionEnd) {
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
        
        function resetGraphSelection() {
            console.log("resetGraphSelection");
            if (!graphBrowserInstance.currentGraph) {
                // TODO: Translate
                alert("Please select a pattern first");
                return;
            }
            
            // TODO: Need better approach to finding brush extent text and safely parsing it

            // Find observation textarea and other needed data
            var observationTextarea = widgets.observation;
            var textModel = graphBrowserInstance.observationModel;
            var textarea = observationTextarea.textbox;
            var oldText = textModel.get("observation");

            textarea.focus();

            var selectionStart = textarea.selectionStart;
            var selectionEnd = textarea.selectionEnd;

            // var selectedText = oldText.substring(selectionStart, selectionEnd);
            var selectedText = scanForSelectionJSON(oldText, selectionStart, selectionEnd);
            if (!selectedText) {
                // TODO: Translate
                alert("The text insertion point was not inside a graph selection description.\nTry clicking inside the {...} items first.");
                return;
            }
            
            var extent = null;
            try {
                extent = JSON.parse(selectedText).selection;
            } catch (e) {
                console.log("JSON parse error", e);
            }
            if (!extent) {
                // TODO: Translate
                alert('The selected text was not a complete valid stored selection.\nTry clicking inside the {...} items first.');
                return;
            }
            console.log("new extent", extent);
            
            // TODO: Should check chart itself too
            if (_.isArray(graphBrowserInstance.currentGraph)) {
                var graphs = graphBrowserInstance.currentGraph;
                var extents = extent;
                if (!_.isArray(extents)) {
                    // TODO: Translate
                    alert("Incorrect format for selection -- should be an array of extents");
                } else {
                    for (var i = 0; i < Math.max(graphs.length, extents.length); i++) {
                        var graph = graphs[i];
                        graph.brush.brush.extent(extents[i]);
                        graph.brush.brush(graph.brush.brushGroup);
                        graph.brushend();
                    }
                }
            } else {
                graphBrowserInstance.currentGraph.brush.brush.extent(extent);
                graphBrowserInstance.currentGraph.brush.brush(graphBrowserInstance.currentGraph.brush.brushGroup);
                graphBrowserInstance.currentGraph.brushend();
            }
        }
        
        var loadLatestStoriesFromServerSubscription = topic.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStoriesFromServerChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        graphResultsPane.own(loadLatestStoriesFromServerSubscription);
        
        var currentQuestionnaireSubscription = topic.subscribe("currentQuestionnaire", lang.partial(currentQuestionnaireChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        graphResultsPane.own(currentQuestionnaireSubscription);
        
        // TODO: Not sure what to return or if it matters
        return questionContentPane;
    }

    return add_trendsReport;
});