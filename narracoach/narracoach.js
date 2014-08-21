"use strict";

require([
    "dojo/_base/array",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "narracoach/narracoach_questions",
    "dojo/on",
    "dojo/query",
    "narracoach/question_editor",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dojo/_base/xhr",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    "dojox/charting/axis2d/Default",
    "dijit/Dialog",
    "dijit/form/Form",
    "dgrid/Grid",
    "dojox/charting/plot2d/Lines",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid",
    "dijit/layout/TabContainer",
    "dojo/domReady!"
    ], function(
        array,
        dom,
        domConstruct,
        domStyle,
        narracoach_questions,
        on,
        query,
        question_editor,
        registry,
        translate,
        widgets,
        xhr,
        Bars,
        Chart,
        Columns,
        ContentPane,
        Default,
        Dialog,
        Form,
        Grid,
        Lines,
        Memory,
        OnDemandGrid,
        TabContainer
    ){
    
    var storyList = [
	    { title: "The night the bed fell", body: "Story 1..." },
	    { title: "The golden faucets", body: "Story 2..."},
	    { title: "More pickles!", body: "Story 3...",}
	];
    
    var projectStoriesStore = new Memory({
    	data: storyList,
		// TODO: title may not be unique
        idProperty: "title",
    });
    
    createLayout();

    var storyListGrid;
    
    function createLayout() {
        // Store reference so can be used from inside narracoach_questions.js
        window.narracoach_translate = translate;
        window.narracoach_registry_byId = registry.byId;
        window.narracoach_domStyle = domStyle;
        
        var tabContainer = new TabContainer({
            tabPosition: "left-h",
            //tabPosition: "top",
            style: "width: 100%",
            // have the tab container height change to match internal panel
            doLayout: false,
        }, "tabContainerDiv");

        // Add pages defined in narracoach_questions.js
        
        array.forEach(narracoach_questions.pageList, function(page) {
        	// This page is handled in a popup dialog for story entry
        	if (page.id !== "page_projectStoryEntry") addPage(tabContainer, page);
        });
    
        // Project story list pane
        
        var projectStoryListPane = new ContentPane({
            title: "Project story list"
        });
        
        var pane = projectStoryListPane.containerNode;
             
        var grid = new OnDemandGrid({
        	store: projectStoriesStore,
            columns: {
                title: "Story title",
                body: "Story text",
            }
        });
        
        // grid.renderArray(storyList);
        storyListGrid = grid;
        
        pane.appendChild(grid.domNode);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        var addStoryButton = widgets.newButton("Add story", pane, addProjectStory);
                
        tabContainer.addChild(projectStoryListPane);
        projectStoryListPane.startup();
        
        // Design questions pane
        
        var designQuestionsPane = new ContentPane({
             title: "Design questions"
        });
        
        pane = designQuestionsPane.containerNode;
        pane.appendChild(domConstruct.toDom("<b>NarraCoach</b>"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom("Survey Design"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom('<div id="questionsDiv"/>'));
        var addQuestionButton = widgets.newButton("Add question", pane, addQuestion);
        pane.appendChild(document.createElement("br"));
    
        tabContainer.addChild(designQuestionsPane);
        designQuestionsPane.startup();
        
        // Export survey pane
        
        var exportSurveyPane = new ContentPane({
            title: "Export survey"
        });
        
        pane = exportSurveyPane.containerNode;
        var exportSurveyQuestionsButton = widgets.newButton("Export survey questions", pane, exportSurveyQuestions);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Definition<br><div id="surveyDiv"></div>'));
        
        tabContainer.addChild(exportSurveyPane);
        exportSurveyPane.startup();
        
        // Take survey pane
        
        var takeSurveyPane = new ContentPane({
            title: "Take survey"
        });
        
        pane = takeSurveyPane.containerNode;
        var takeSurveyButton = widgets.newButton("Take survey", pane, takeSurvey);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Results<br><div id="surveyResultsDiv"></div>'));
        
        tabContainer.addChild(takeSurveyPane);
        takeSurveyPane.startup();
        
        // Graph results pane
        
        var graphResultsPane = new ContentPane({
            title: "Graph results"
        });
        
        pane = graphResultsPane.containerNode;
        var takeSurveyButton = widgets.newButton("Update Graph", pane, updateGraph);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Graph<br><div id="surveyGraphDiv"></div><div id="chartDiv" style="width: 250px; height: 150px; margin: 5px auto 0px auto;"></div>'));

        tabContainer.addChild(graphResultsPane);
        graphResultsPane.startup();
        
        // Main startup
        
        tabContainer.startup();
    }
    
    function addPage(tabContainer, page) {
        var pageTitle = translate(page.id + "_title");
        if (!pageTitle) {
            var errorMessage = "ERROR: No page title for " + page.id;
            console.log(errorMessage);
            pageTitle = errorMessage;
        }
        
        var pagePane = new ContentPane({
            title: pageTitle,
            style: "width: 100%"
       });

       var pageText = translate(page.id + "_text");
                                
       if (pageText) {
           pagePane.containerNode.appendChild(domConstruct.toDom(pageText));
           pagePane.containerNode.appendChild(domConstruct.toDom("<br><br>"));
       }

       if (page.questions) {
           console.log("questions for page", page.id);
           question_editor.insertQuestionsIntoDiv(page.questions, pagePane.containerNode);
       }
   
       tabContainer.addChild(pagePane); 
       pagePane.startup();
    }
    
    var testCount = 0;
    
    function addProjectStory() {
    	console.log("addProjectStory pressed");
        var addStoryDialog;
        
        var form = new Form();
        
        var page = narracoach_questions.pageList[2];
        
        var pageText = translate(page.id + "_text");
        
        if (pageText) {
            form.domNode.appendChild(domConstruct.toDom(pageText));
            form.domNode.appendChild(domConstruct.toDom("<br><br>"));
        }

        if (page.questions) {
            console.log("questions for page", page.id);
            question_editor.insertQuestionsIntoDiv(page.questions, form.domNode);
        }

        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("OK", form, function() {
            console.log("OK");
            addStoryDialog.hide();
            // addStoryDialogOK(question, questionEditorDiv, form);

            var count = ++testCount;
            var newStory = { title: "More pickles " + count + "!", body: "Story " + count + "...",};
            projectStoriesStore.put(newStory);
            storyListGrid.refresh();
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("Cancel", form, function() {
            console.log("Cancel");
            addStoryDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        addStoryDialog = new Dialog({
            title: "Add project story",
            content: form,
            style: "width: 600px; height 800px; overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        addStoryDialog.startup();
        addStoryDialog.show();
    }
        
    // TODO: Challenge of repeating sections....

    var questionIndex = 1;
    
    function addQuestion() {
        var questionsDiv = document.getElementById("questionsDiv");
        var question = {index: questionIndex, id: "Q" + questionIndex, type: "text", text: "Question text " + questionIndex, help: 'Question help ' + questionIndex};
        questionIndex += 1;
        question_editor.insertQuestionEditorDivIntoDiv(question, questionsDiv);
    }
    
    var surveyResults = [];
    var surveyItemPrefix = "survey_";
    
    function submitSurvey(form) {
        var answers = {};
        console.log("submitSurvey pressed");
        var nodes = query(".narracoachQuestion", form.domNode);
        // console.log("nodes", nodes);
        nodes.forEach(function(questionDiv) {
            console.log("submitSurvey question Node", questionDiv);
            var questionID = questionDiv.getAttribute("data-narracoach-question-id");
            var valueNode = registry.byId(questionID);
            var questionValue = undefined;
            if (valueNode) questionValue = valueNode.get("value");
            console.log("answer", questionDiv, questionID, valueNode, questionValue);
            // trim off "survey_" part of id
            // var questionID = questionID.substring(surveyItemPrefix.length);
            answers[questionID] = questionValue;
        });
        
        console.log("answers", JSON.stringify(answers));
        surveyResults.push(answers);
        
        var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        surveyResultsDiv.innerHTML = JSON.stringify(surveyResults);
    }
    
    var exportedSurveyQuestions = [];
    
    function exportSurveyQuestions() {
        var questions = [];
        var nodes = query(".narracoachQuestionEditor", "questionsDiv");
        // console.log("nodes", nodes);
        nodes.forEach(function(node) {
            // console.log("Node", node);
            var questionText = node.getAttribute("data-narracoach-question");
            var question = JSON.parse(questionText);
            question.id = surveyItemPrefix + question.id;
            questions.push(question);
        });
        console.log("questions", JSON.stringify(questions));
        var surveyDiv = document.getElementById("surveyDiv");
        surveyDiv.innerHTML = JSON.stringify(questions);
        exportedSurveyQuestions = questions;
        // question_editor.insertQuestionsIntoDiv(questions, surveyDiv);
        // var submitSurveyButton = widgets.newButton("Submit survey", "surveyDiv", submitSurvey);
    }

    function takeSurvey() {
        var surveyDialog;
        
        var form = new Form();
        
        question_editor.insertQuestionsIntoDiv(exportedSurveyQuestions, form.domNode);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("Submit survey", form, function() {
            console.log("Submit survery");
            surveyDialog.hide();
            submitSurvey(form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("Cancel", form, function() {
            console.log("Cancel");
            surveyDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form,
            style: "width: 600px",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        surveyDialog.startup();
        surveyDialog.show();
    }
    
    function updateGraph() {
        console.log("updateGraph");
        
        var widgets = dijit.findWidgets("chartDiv");
        array.forEach(widgets, function(widget) {
            widget.destroyRecursive(true);
        });
        domConstruct.empty("chartDiv");
        
        var chart1Div = domConstruct.create("div", {style: "width: 500px; height: 500px;"}, "chartDiv");
        
        var chart1Data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var chart1Title = "Title goes here";
        
        var theSlider = null;
        array.forEach(exportedSurveyQuestions, function(each) {
            if (each.type == "slider") {
                theSlider = each.id;
                chart1Title = each.text;
            }
        });
        
        if (theSlider != null) {
            array.forEach(surveyResults, function(each) {
                var answer = each[theSlider];
                console.log("answer", answer);
                var slot = Math.round(answer / 10);
                chart1Data[slot] += 1;
            });
        }
        
        // var chart1Data = [1, 2, 2, 3, 4, 5, 5, 2];
        
        var chart1 = new Chart(chart1Div, {title: chart1Title});
        console.log("Made chart");
        chart1.addPlot("default", {
            type: Columns,
            markers: true,
            gap: 5
        });
        
        // labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        // includeZero: true,
        
        chart1.addAxis("x", { labels: [
            {value: 1, text: "0-4"},
            {value: 2, text: "10"},
            {value: 3, text: "20"},
            {value: 4, text: "30"},
            {value: 5, text: "40"},
            {value: 6, text: "50"},
            {value: 7, text: "60"},
            {value: 8, text: "70"},
            {value: 9, text: "80"},
            {value: 10, text: "90"},
            {value: 11, text: "95-100"}
        ]});
        chart1.addAxis("y", {vertical: true, includeZero: true});
        chart1.addSeries("Series 1", chart1Data);
        chart1.render();
        
        /*
        var chart2Div = domConstruct.create("div", {}, "chartDiv");
        
        var chart2 = new Chart(chart2Div);
        console.log("Made chart 2");
        chart2.addPlot("default", {type: Lines});
        chart2.addAxis("x");
        chart2.addAxis("y", {vertical: true});
        chart2.addSeries("Series 1", [10, 12, 2, 3, 4, 5, 5, 7]);
        chart2.render();
        */
        
        // var surveyGraphDiv = document.getElementById("surveyGraphDiv");
        // chart1.placeAt(surveyGraphDiv);     
    }
});