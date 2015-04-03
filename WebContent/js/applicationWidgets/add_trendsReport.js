define([
    "dojo/_base/array",
    "./charting",
    "dijit/layout/ContentPane",
    "js/domain",
    "js/surveyCollection"
], function(
    array,
    charting,
    ContentPane,
    domain,
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
     
        nominalQuestions.forEach(function (question1) {
            result.push({type: "bar", name: nameForQuestion(question1) + " (C)", questions: [question1]});
        });
        
        // TODO: Should mirror duplicates and self-matching be allowed?
        
        nominalQuestions.forEach(function (question1) {
            nominalQuestions.forEach(function (question2) {
                result.push({type: "table", name: nameForQuestion(question1) + " (C) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        ratioQuestions.forEach(function (question1) {
            result.push({type: "histogram", name: nameForQuestion(question1) + " (S)", questions: [question1]});
        });
        
        ratioQuestions.forEach(function (question1) {
            nominalQuestions.forEach(function (question2) {
                result.push({type: "multiple histogram", name: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (C)", questions: [question1, question2]});
            });
        });
        
        ratioQuestions.forEach(function (question1) {
            ratioQuestions.forEach(function (question2) {
                result.push({type: "scatter", name: nameForQuestion(question1) + " (S) vs. " + nameForQuestion(question2) + " (S)", questions: [question1, question2]});
            });
        });
        
        /* TODO: For later
        ratioQuestions.forEach(function (question1) {
            ratioQuestions.forEach(function (question2) {
                nominalQuestions.forEach(function (question3) {
                    result.push({name: nameForQuestion(question1) + " (S)" + " vs. " + nameForQuestion(question2) + " (S) vs. " + nameForQuestion(question3) + " (C)", questions: [question1, question2, question3]});
                });
            });
        });
        */
        
        console.log("buildPatternsList", result);
        return result;
    }
    
    function chooseGraph(graphBrowserInstance, i) {
        console.log("chooseGraph", i);
        
        // Remove old graph(s)
        while (graphBrowserInstance.chartPanes.length) {
            var chartPane = graphBrowserInstance.chartPanes.pop();
            chartPane.destroyRecursive(false);
        }
        
        var pattern = graphBrowserInstance.patterns[i];
        var name = pattern.name;
        var type = pattern.type;
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
        graphBrowserInstance.storiesPane.set("content", "<pre>" + JSON.stringify(stories, null, 4) + "</pre>");
    }

    function add_trendsReport(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results",
            style: chartEnclosureStyle
        });
        
        var graphBrowserInstance = {
            graphResultsPane: graphResultsPane,
            chartPanes: [], 
            questions: questions,
            allStories: domain.allStories,
            patterns: null,
            storiesPane: null
        };
        
        var patterns = buildPatternList(graphBrowserInstance);
        
        graphBrowserInstance.patterns = patterns;
        
        var patternHTML = "";
        var i = 0;
        patterns.forEach(function (pattern) {
            patternHTML += '<br><a href="#page_reviewTrends" id="trend-' + i + '">' + pattern.name + '</a>';
            i = i + 1;
        });
        
        var label = new ContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_trendsReport: " + fieldSpecification.id + "</b>" + patternHTML         
        });
        label.placeAt(questionContentPane);
        
        i = 0;
        patterns.forEach(function (pattern) {
            var a = document.getElementById("trend-" + i);
            var choice = i;
            a.onclick = function () { chooseGraph(graphBrowserInstance, choice); return false; };
            i++;
        });
        
        contentPane.addChild(graphResultsPane);
        
        var storiesPane = new ContentPane({
            content: "Stories go here..."        
        });
        storiesPane.placeAt(contentPane);
        
        graphBrowserInstance.storiesPane = storiesPane;
        
        return label;
    }

    return add_trendsReport;
});