define([
    "dojo/_base/array",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/questionnaireGeneration",
    "js/surveyCollection",
    "js/panelBuilder/widgetSupport",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    "dojox/charting/plot2d/Scatter",
    "dojox/layout/TableContainer"
], function(
    array,
    dom,
    domain,
    domConstruct,
    lang,
    questionnaireGeneration,
    surveyCollection,
    widgetSupport,
    Chart,
    Columns,
    ContentPane,
    Scatter,
    TableContainer
){
    "use strict";

    // TODO: Need to be able to associate related stories with everything on screen so can browse them when clicked
    
    var unansweredKey = "{Unanswered}";
    var singleChartStyle = "width: 800px; height: 600px;";
    var multipleChartStyle = "width: 200px; height: 150; float: left;";
    var chartEnclosureStyle = "width: 850px; height: 650px; margin: 5px auto 0px auto;";
        
    function correctForUnanswered(question, value) {
        if (question.displayType === "checkbox" && !value) return "no";
        if (value === undefined || value === null || value === "") return unansweredKey;
        return value;
    }
    
    function questionForID(questions, id) {
        if (!id) return null;
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
        if (question.displayType === "boolean" || question.displayType === "checkbox") {
            if (answer === "no") return 0;
            if (answer === "yes") return 100;
            return -100;
        }
        
        // TODO: How to display sliders when unanswered? Add one here?
        // TODO: Check that answer is numerical
        if (question.displayType === "slider") {
            console.log("slider answer", answer);
            if (answer === unansweredKey) return -10;
            return answer;
        }
        
        // Doesn't work for text...
        if (question.displayType === "text") {
            console.log("TODO: positionForQuestionAnswer does not work for text");
            return 0;
        }
        
        // Adjust for question types without options
        
        // TODO: Should probably review this further related to change for options to dataOptions and displayConfiguration
        var options = [];
        if (question.dataOptions) options = question.dataOptions;
        var answerCount = options.length;
        
        // Adjust for unanswered items
        // if (question.displayType !== "checkboxes") answerCount += 1;
        
        if (answer === unansweredKey) {
            return -100 * 1 / (options.length - 1);
        }
        
        var answerIndex = options.indexOf(answer);
        console.log("answerIndex", answerIndex);

        var position = 100 * answerIndex / (options.length - 1);
        console.log("calculated position: ", position);

        return position;  
    }
    
    function newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story) {
        // console.log("newPlotItem", xAxisQuestion, yAxisQuestion, xValue, yValue, story);
        
        // Plot onto a 100 x 100 value to work with sliders
        var x = positionForQuestionAnswer(xAxisQuestion, xValue);
        var y = positionForQuestionAnswer(yAxisQuestion, yValue);
        return {x: x, y: y, story: story};
    }
    
    function addAxis(chart, axis, question) {
        // TODO: Translate, especially booleans
        var type = question.displayType;
        if (type === "boolean" || type === "checkbox") {
            chart.addAxis(axis, {
               labels: [
                   {value: -100, text: unansweredKey},
                   {value: 0, text: "No"},
                   {value: 100, text: "Yes"}
               ], 
               vertical: axis === "y",
               includeZero: true
            });
        } else if (type === "slider") {
            chart.addAxis(axis, {
                labels: [
                    {value: -10, text: unansweredKey},
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
            var increment = 100 / (question.dataOptions.length - 1);
            var labels = [
               {value: -increment, text: unansweredKey}
            ];
            for (var i = 0; i < question.dataOptions.length; i++) {
                labels.push({value: i * increment, text: question.dataOptions[i]});
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
    
    function incrementMapSlot(map, key) {
        var oldCount = map[key];
        if (!oldCount) oldCount = 0;
        map[key] = oldCount + 1;
    }
    
    function preloadResultsForQuestionOptions(results, question) {
        /*jshint -W069 */
        var type = question.displayType;
        results[unansweredKey] = 0;
        if (type === "boolean" || type === "checkbox") {
            results["no"] = 0;
            results["yes"] = 0;
        } else if (question.dataOptions) {
            for (var i = 0; i < question.dataOptions.length; i++) {
                results[question.dataOptions[i]] = 0;
            }
        }
    }
    
    function barChart(mainChartDiv, question) {
         
        // collect data
        var plotItems = [];
        var plotLabels = [];
        var results = {};
        
        var stories = domain.allStories;
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            var xValue = correctForUnanswered(question, story[question.id]);
            
            var xHasCheckboxes = lang.isObject(xValue);
            // fast path
            if (!xHasCheckboxes) {
                incrementMapSlot(results, xValue);
            } else {
                console.log(question, xValue);
                for (var xIndex in xValue) {
                    if (xValue[xIndex]) incrementMapSlot(results, xIndex);
                }
            }
        }
        
        var resultIndex = 1;
        
        preloadResultsForQuestionOptions(results, question);
        
        // Keep unanswered at start
        var key = unansweredKey;
        plotLabels.push({value: resultIndex, text: key});
        plotItems.push({x: resultIndex, y: results[key]});
        resultIndex++;
        
        for (key in results) {
            if (key === unansweredKey) continue;
            plotLabels.push({value: resultIndex, text: key});
            plotItems.push({x: resultIndex, y: results[key]});
            resultIndex++;
        }
        
        console.log("plot items", plotItems);

        var chartDiv = domConstruct.create("div", {style: singleChartStyle}, "chartDiv");
        
        var chartTitle = "" + question.id;
        
        var chart = new Chart(chartDiv, {
            title: chartTitle
        });
        console.log("Made chart");
        
        // TODO: Set theme
        
        chart.addPlot("default", {
            type: Columns,
            markers: true,
            gap: 5
        });
        
        chart.addAxis("x", {labels: plotLabels, fixLower: "major", fixUpper: "major"});
        chart.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major" });

        chart.addSeries("Series 1", plotItems);
        
        chart.render(); 
    }
    
    // choiceQuestion and option may be undefined if this is just a simple histogram for all values
    function histogramChart(mainChartDiv, scaleQuestion, choiceQuestion, choice) {
        // console.log("mainChartDiv, scaleQuestion", mainChartDiv, scaleQuestion);
        
        // TODO: Statistics
        
        // collect data
        var plotItems = [];
        var results = {};
        
        var stories = domain.allStories;
        for (var storyIndex in stories) {
            var story = stories[storyIndex];
            var xValue = correctForUnanswered(scaleQuestion, story[scaleQuestion.id]);
            if (choiceQuestion) {
                // Only count results where the choice matches
                var choiceValue = correctForUnanswered(choiceQuestion, story[choiceQuestion.id]);
                var skip = false;
                if (choiceQuestion.displayType === "checkboxes") {
                    if (!choiceValue[choice]) skip = true;
                } else {
                    if (choiceValue !== choice) skip = true;
                }
                if (skip) continue;
            }
            incrementMapSlot(results, xValue);
        }
        
        var resultIndex = 1;
        
        // TODO: What about unanswered?
        
        //var key = unansweredKey;
        //plotLabels.push({value: resultIndex, text: key});
        //plotItems.push({x: resultIndex, y: results[key]});
        //resultIndex++;
        
        plotItems.push({x: -1, y: results[unansweredKey]});
        for (var i = 0; i < 100; i++) {
            plotItems.push({x: i, y: results[i]});
        }
        
        // console.log("plot items", plotItems);
        
        var style = singleChartStyle;
        if (choiceQuestion) style = multipleChartStyle;

        var chartDiv = domConstruct.create("div", {style: style}, "chartDiv");
        
        var chartTitle = "" + scaleQuestion.id;
        if (choiceQuestion) chartTitle = "" + choice;
        
        var chart = new Chart(chartDiv, {
            title: chartTitle
        });
        console.log("Made chart");
        
        // TODO: Set theme
        
        chart.addPlot("default", {
            type: Columns,
            markers: true,
            gap: 5
        });
        
        chart.addAxis("x", {fixLower: "none", fixUpper: "major", includeZero: true});
        chart.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major" });

        chart.addSeries("Series 1", plotItems);
        
        chart.render(); 
    }
    
    function multipleHistograms(mainChartDiv, choiceQuestion, scaleQuestion) {
        var options = [];
        var index;
        if (choiceQuestion.displayType !== "checkbox" && choiceQuestion.displayType !== "checkboxes") {
            options.push(unansweredKey);
        }
        if (choiceQuestion.displayType === "boolean" || choiceQuestion.displayType === "checkbox") {
            options.push("no");
            options.push("yes");
        } else if (choiceQuestion.dataOptions) {
            for (index in choiceQuestion.dataOptions) {
                options.push(choiceQuestion.dataOptions[index]);
            }
        }
        // TODO: Could push extra options based on actual data choices (in case question changed at some point)
        
        var title = "" + scaleQuestion.id + " vs. " + choiceQuestion.id + " ...";
        // var content = new ContentPane({content: title, style: "text-align: center;"});
        var content = domConstruct.toDom('<span style="text-align: center;"><b>' + title + '</b></span>');
        var chartDiv = dom.byId("chartDiv");
        chartDiv.appendChild(content);
        
        domConstruct.create("br", {}, "chartDiv");
        
        for (index in options) {
            var option = options[index];
            histogramChart(mainChartDiv, scaleQuestion, choiceQuestion, option);
        }
        
        // End the float
        domConstruct.create("br", {style: "clear: left;"}, "chartDiv");
    }
    
    function scatterPlot(mainChartDiv, xAxisQuestion, yAxisQuestion) {
        // collect data
        var plotItems = [];
        var stories = domain.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            // TODO: What do do about unanswered?
            if (xValue === unansweredKey || yValue === unansweredKey) continue;
            
            var plotItem = newPlotItem(xAxisQuestion, yAxisQuestion, xValue, yValue, story);
            plotItems.push(plotItem);
        }
        // console.log("plot items", plotItems);

        var chartDiv = domConstruct.create("div", {style: singleChartStyle}, "chartDiv");
        
        var chartTitle = "" + xAxisQuestion.id + " vs. " + yAxisQuestion.id;
        
        var chart = new Chart(chartDiv, {
            title: chartTitle
        });
        console.log("Made chart");
        
        // TODO: Set theme
        
        chart.addPlot("default", {
            type: Scatter
        });
        
        // TODO: What do do about unanswered?
        
        chart.addAxis("x", {
            labels: [
                //{value: -10, text: unansweredKey},
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
           vertical: false,
           includeZero: true,
           fixLower: "major",
           fixUpper: "major"
        });
        
        chart.addAxis("y", {
            labels: [
                //{value: -10, text: unansweredKey},
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
           vertical: true,
           includeZero: true,
           fixLower: "major",
           fixUpper: "major" 
        });

        chart.addSeries("Series 1", plotItems);
        
        chart.render(); 
    }
    
    function contingencyTable(mainChartDiv, xAxisQuestion, yAxisQuestion) {
        var columnLabels = {};
        var rowLabels = {};
        
        preloadResultsForQuestionOptions(columnLabels, xAxisQuestion);
        preloadResultsForQuestionOptions(rowLabels, yAxisQuestion);
        
        //columnLabels["{Total}"] = 0;
        //rowLabels["{Total}"] = 0;
        
        // collect data
        var results = {};
        var grandTotal = 0;
        var stories = domain.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestion.id]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestion.id]);
            
            var plotItem;
            var xHasCheckboxes = lang.isObject(xValue);
            var yHasCheckboxes = lang.isObject(yValue);
            // fast path
            if (!xHasCheckboxes && !yHasCheckboxes) {
                incrementMapSlot(results, JSON.stringify({x: xValue, y: yValue}));
                incrementMapSlot(results, JSON.stringify({x: xValue}));
                incrementMapSlot(results, JSON.stringify({y: yValue}));
                grandTotal++;
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
                        // TODO: Need to include stories...
                        incrementMapSlot(results, JSON.stringify({x: xValues[xIndex], y: yValues[yIndex]}));
                        incrementMapSlot(results, JSON.stringify({x: xValues[xIndex]}));
                        incrementMapSlot(results, JSON.stringify({y: yValues[yIndex]}));
                        grandTotal++;
                    }
                }
            }
        }
        
        var columnLabelsArray = [];
        for (var columnName in columnLabels) {
            columnLabelsArray.push(columnName);
        }
        var columnCount = columnLabelsArray.length;
        
        var rowLabelsArray = [];
        for (var rowName in rowLabels) {
            rowLabelsArray.push(rowName);
        }
        var rowCount = rowLabelsArray.length;
        
        var chartDiv = domConstruct.create("div", {style: singleChartStyle}, "chartDiv");
        
        var table = new TableContainer({
            cols: columnCount + 2,
            showLabels: false,
            customClass: "contingencyTable",
            style: "width: 98%;",
            spacing: 10
        }, chartDiv);
        
        
        var content;
        var row;
        var column;
        
        content = new ContentPane({content: "&lt;- <b>" + xAxisQuestion.id + "</b> -&gt;", colspan: columnCount + 2, style: "text-align: center;"});
        table.addChild(content);
        
        content = new ContentPane({content: "V <b>" + yAxisQuestion.id + "</b> V", colspan: 1});
        table.addChild(content);
        
        for (column = 0; column < columnCount; column++) {
            content = new ContentPane({content: "<i>" + columnLabelsArray[column] + "</i>", colspan: 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "<i>[Row Total]</i>", colspan: 1});
        table.addChild(content);
        
        for (row = 0; row < rowCount; row++) {
            content = new ContentPane({content: "<i>" + rowLabelsArray[row] + "</i>", colspan: 1});
            table.addChild(content);
            
            for (column = 0; column < columnCount; column++) {
                var cellValue = results[JSON.stringify({x: columnLabelsArray[column], y: rowLabelsArray[row]})];
                if (!cellValue) cellValue = 0;
                content = new ContentPane({content: "<b>" + cellValue + "</b>", colspan: 1});
                table.addChild(content);
            }
            content = new ContentPane({content: "" + results[JSON.stringify({y: rowLabelsArray[row]})], "colspan": 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "<i>[Column Total]</i>", colspan: 1});
        table.addChild(content);
        for (column = 0; column < columnCount; column++) {
            content = new ContentPane({content: "" + results[JSON.stringify({x: columnLabelsArray[column]})], colspan: 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "" + grandTotal, colspan: 1});
        table.addChild(content);
    }
    
    
    function updateGraph(graphResultsPane) {
        console.log("updateGraph", graphResultsPane);
        
        var xAxisQuestionID = graphResultsPane.xAxisSelect.get("value");
        var yAxisQuestionID = graphResultsPane.yAxisSelect.get("value");
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return alert("Please select a question for one or both graph axes");
        
        // Remove old graph(s) and create a place to put one
        var widgets = dijit.findWidgets("chartDiv");
        array.forEach(widgets, function(widget) {
            widget.destroyRecursive(true);
        });
        var chartDiv = domConstruct.empty("chartDiv");
        
        // TODO: Fix this so it also handles participant questions somehow
        var surveyQuestions = domain.currentQuestionnaire.storyQuestions;
        
        var xAxisQuestion = questionForID(surveyQuestions, xAxisQuestionID);
        var yAxisQuestion = questionForID(surveyQuestions, yAxisQuestionID);
        
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
            console.log("barGraph", chartDiv, xAxisQuestion);
            barChart(graphResultsPane, xAxisQuestion);
        } else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            contingencyTable(graphResultsPane, xAxisQuestion, yAxisQuestion);
        } else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphResultsPane, xAxisQuestion, yAxisQuestion);
        } else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            histogramChart(graphResultsPane, xAxisQuestion);
        } else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphResultsPane, yAxisQuestion, xAxisQuestion);
        } else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            scatterPlot(graphResultsPane, xAxisQuestion, yAxisQuestion);
        } else {
            console.log("ERROR: Unexpected graph type");
            alert("ERROR: Unexpected graph type");
            return;
        }

        /*
              
        // collect data
        var plotItems = [];
        var stories = domain.allStories;
        for (var index in stories) {
            var story = stories[index];
            var xValue = correctForUnanswered(xAxisQuestion, story[xAxisQuestionID]);
            var yValue = correctForUnanswered(yAxisQuestion, story[yAxisQuestionID]);
            
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
        

        
        var chart1Div = domConstruct.create("div", {style: singleChartStyle}, "chartDiv");
        
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
        */
    }
        
    function insertGraphBrowser(contentPane, model, fieldSpecification) {       
        // Graph results pane
        
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results"
        });
        
        // TODO: Fix this so it also handles participant questions somehow
        // TODO: Update these as they change...
        var questions = domain.currentQuestionnaire.storyQuestions;
        
        var optionsForAllQuestions = widgetSupport.optionsForAllQuestions(questions);
        
        var xAxisSelect = widgetSupport.newSelect(contentPane, optionsForAllQuestions);
        xAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        // TODO: Translate
        var content = new ContentPane({content: " versus ", style: "display: inline;"});
        contentPane.addChild(content);
        
        var yAxisSelect = widgetSupport.newSelect(contentPane, optionsForAllQuestions);
        yAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        var pane = graphResultsPane.containerNode;
        var takeSurveyButton = widgetSupport.newButton(pane, "#updateGraph|Update graph", lang.partial(updateGraph, graphResultsPane));
        pane.appendChild(document.createElement("br"));
        
        // TODO: Translate "Survey Graph"
        pane.appendChild(domConstruct.toDom('<br><div id="surveyGraphDiv"></div><div id="chartDiv" style="' + chartEnclosureStyle + '"></div>'));
        contentPane.addChild(graphResultsPane);
        
        graphResultsPane.xAxisSelect = xAxisSelect;
        graphResultsPane.yAxisSelect = yAxisSelect;
        
        return graphResultsPane;
    }

    function add_graphBrowser(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var graphBrowserInstance = insertGraphBrowser(questionContentPane, model, fieldSpecification);
        questionContentPane.resize();
        return graphBrowserInstance;
    }

    return add_graphBrowser;
    
});