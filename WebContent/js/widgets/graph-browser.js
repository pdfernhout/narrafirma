"use strict";

define([
    "dojo/_base/array",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/translate",
    "js/utility",
    "./widgetSupport",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/plot2d/Scatter"
], function(
    array,
    domain,
    domConstruct,
    lang,
    translate,
    utility,
    widgetSupport,
    Bars,
    Chart,
    Columns,
    ContentPane,
    Default,
    Lines,
    Markers,
    Scatter
){
    function correctForUnanswered(value) {
        if (value === undefined || value === null || value === "") return "{Unanswered}";
        return value;
    }
    
    function questionForID(questions, id) {
        for (var index in questions) {
            var question = questions[index];
            if (question.id === id) return question;
        }
        console.log("ERROR: question not found for id", id, questions);
        return null;
    }
    
    function positionForQuestionAnswer(question, answer) {
        // console.log("positionForQuestionAnswer", question, answer);
        
     // TODO: Confirm checkbox values are also yes/no...
        if (question.type === "boolean" || question.type === "checkbox") {
            if (answer === "no") return 0;
            if (answer === "yes") return 100;
            return -100;
        }
        
        // TODO: How to display sliders when unanswered? Add one here?
        // TODO: Check that answer is numerical
        if (question.type === "slider") {
            console.log("slider answer", answer);
            if (answer === "{Unanswered}") return -10;
            return answer;
        }
        
        // Doesn't work for text...
        if (question.type === "text") {
            console.log("TODO: positionForQuestionAnswer does not work for text");
            return 0;
        }
        
        // Adjust for question types without options
        
        var answerCount = question.options.length;
        
        // Adjust for unanswered items
        // if (question.type !== "checkboxes") answerCount += 1;
        
        if (answer === "{Unanswered}") {
            return -100 * 1 / (question.options.length - 1);
        }
        
        var answerIndex = question.options.indexOf(answer);
        console.log("answerIndex", answerIndex);

        var position = 100 * answerIndex / (question.options.length - 1);
        console.log("calculated position: ", position);

        return position;  
    }
    
    function newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story) {
        console.log("newPlotItem", xAxisQuestion, yAxisQuestion, xValue, yValue, story);
        
        // Plot onto a 100 x 100 value to work with sliders
        var x = positionForQuestionAnswer(xAxisQuestion, xValue);
        var y = positionForQuestionAnswer(yAxisQuestion, yValue);
        return {x: x, y: y, story: story};
    }
    
    function addAxis(chart, axis, question) {
        // TODO: Translate, especially booleans
        var type = question.type;
        if (type === "boolean" || type == "checkbox") {
            chart.addAxis(axis, {
               labels: [
                   {value: -100, text: "{Unanswered}"},
                   {value: 0, text: "No"},
                   {value: 100, text: "Yes"},
               ], 
               vertical: axis === "y",
               includeZero: true
            });
        } else if (type === "slider") {
            chart.addAxis(axis, {
                labels: [
                    {value: -10, text: "{Unanswered}"},
                    {value: 0, text: "0"},
                    {value: 10, text: "10"},
                    {value: 20, text: "20"},
                    {value: 30, text: "30"},
                    {value: 40, text: "40"},
                    {value: 50, text: "50"},
                    {value: 60, text: "60"},
                    {value: 70, text: "70"},
                    {value: 80, text: "80"},
                    {value: 90, text: "90"},
                    {value: 100, text: "100"}
               ],
               vertical: axis === "y",
               includeZero: true
            });
        } else {
            var increment = 100 / (question.options.length - 1);
            var labels = [
               {value: -increment, text: "{Unanswered}"},
            ];
            for (var i = 0; i < question.options.length; i++) {
                labels.push({value: i * increment, text: question.options[i]});
            }
            chart.addAxis(axis, {
                labels: labels,
                vertical: axis === "y",
                includeZero: true
            });
        }
        
        // Ideas:
        // chart1.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major"});
    }
    
    function updateGraph(graphResultsPane) {
        console.log("updateGraph", graphResultsPane);
        
        var xAxisQuestionID = graphResultsPane.xAxisSelect.get("value");
        var yAxisQuestionID = graphResultsPane.yAxisSelect.get("value");
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID || !yAxisQuestionID) return alert("Please select a question for each axis");
        
        var surveyQuestions = domain.collectAllSurveyQuestions();
        
        var xAxisQuestion = questionForID(surveyQuestions, xAxisQuestionID);
        var yAxisQuestion = questionForID(surveyQuestions, yAxisQuestionID);
        
        console.log("x y axis values", xAxisQuestion, yAxisQuestion);
              
        // collect data
        var plotItems = [];
        var stories = domain.projectData.surveyResults.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(story[xAxisQuestionID]);
            var yValue = correctForUnanswered(story[yAxisQuestionID]);
            
            var plotItem;
            var xHasCheckboxes = lang.isObject(xValue);
            var yHasCheckboxes = lang.isObject(yValue);
            // fast path
            if (!xHasCheckboxes && !yHasCheckboxes) {
                plotItem = newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story);
                plotItems.push(plotItem);
            } else {
                // one or both may be checkboxes, so do a loop for each and create plot items for every combination         
                var key;
                var xValues = [];
                var yValues = [];
                if (xHasCheckboxes) {
                    // checkboxes
                    for (key in xValue) {
                        if (xValue[key]) xValues.push(key);
                    }
                } else {
                    xValues.push(xValue);                
                }
                if (yHasCheckboxes) {
                    // checkboxes
                    for (key in yValue) {
                        if (yValue[key]) yValues.push(key);
                    }
                } else {
                    yValues.push(yValue);                
                }
                for (var xIndex in xValues) {
                    for (var yIndex in yValues) {
                        plotItem = newPlotItem(xAxisQuestion, yAxisQuestion, xValues[xIndex], yValues[yIndex], story);
                        plotItems.push(plotItem); 
                    }
                }
            }
        }
        
        console.log("plot items", plotItems);
        
        var widgets = dijit.findWidgets("chartDiv");
        array.forEach(widgets, function(widget) {
            widget.destroyRecursive(true);
        });
        domConstruct.empty("chartDiv");
        
        var chart1Div = domConstruct.create("div", {style: "width: 500px; height: 500px;"}, "chartDiv");
        
        var chart1Title = "" + xAxisQuestionID + " vs. " + yAxisQuestionID;
        
        var chart1 = new Chart(chart1Div, {
            title: chart1Title,
        });
        console.log("Made chart");
        
        chart1.addPlot("default", {
            type: Scatter,
            //markers: true,
            //gap: 5
            // margins: {
            //     l: 10,
            //     r: 10,
            //     t: 10,
            //     b: 10
            // },
             // hAxis: xAxisQuestionID,
             // vAxis: yAxisQuestionID,
             // ticks: false
        });
        
        addAxis(chart1, "x", xAxisQuestion);
        addAxis(chart1, "y", yAxisQuestion);

        chart1.addSeries("Series 1", plotItems);
        chart1.render(); 
    }
        
    function insertGraphBrowser(contentPane, model, id, pageDefinitions) {       
        // Graph results pane
        
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results"
        });
        
        var pane = graphResultsPane.containerNode;
        var takeSurveyButton = utility.newButton("updateGraph", null, pane, lang.partial(updateGraph, graphResultsPane));
        pane.appendChild(document.createElement("br"));
        
        // TODO: Translate "Survey Graph"
        pane.appendChild(domConstruct.toDom('Survey Graph<br><div id="surveyGraphDiv"></div><div id="chartDiv" style="width: 550px; height: 550px; margin: 5px auto 0px auto;"></div>'));
        contentPane.addChild(graphResultsPane);
        
        // TODO: Update these as they change...
        var questions = domain.collectAllSurveyQuestions();
        
        var optionsForAllQuestions = widgetSupport.optionsForAllQuestions(questions);
        
        var xAxisSelect = utility.newSelect(id + "_xAxis_question", optionsForAllQuestions, null, contentPane);
        xAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        var yAxisSelect = utility.newSelect(id + "_yAxis_question", optionsForAllQuestions, null, contentPane);
        yAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        graphResultsPane.startup();
        
        graphResultsPane.xAxisSelect = xAxisSelect;
        graphResultsPane.yAxisSelect = yAxisSelect;
        
        return graphResultsPane;
    }

    return {
        insertGraphBrowser: insertGraphBrowser
    };
    
});