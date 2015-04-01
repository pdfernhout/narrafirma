define([
    "dojo/_base/array",
    "lib/d3/d3",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "js/surveyCollection",
    "dojo/topic",
    "js/panelBuilder/widgetSupport",
    "dojox/charting/plot2d/Bars",
    "dojox/charting/Chart",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    // Note that "Default" and maybe some other chart modules seem to be referenced dynamically by graph.
    // So they need to be loaded even if they are not refeneced directly in module.
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/plot2d/Scatter",
    "dojox/layout/TableContainer"
], function(
    array,
    d3,
    dom,
    domain,
    domConstruct,
    lang,
    surveyCollection,
    topic,
    widgetSupport,
    Bars,
    Chart,
    Columns,
    ContentPane,
    Default,
    Lines,
    Markers,
    Scatter,
    TableContainer
){
    "use strict";
    
    console.log("=================================== d3", d3);

    // TODO: Need to be able to associate related stories with everything on screen so can browse them when clicked
    
    var unansweredKey = "{Unanswered}";
    var singleChartStyle = "width: 700px; height: 500px;";
    var multipleChartStyle = "width: 200px; height: 200; float: left;";
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
    
    function nameForQuestion(question) {
        if (question.displayName) return question.displayName;
        if (question.displayPrompt) return question.displayPrompt;
        return question.id;
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
    
    function barChart(graphBrowserInstance, question) {
         
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

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(question);
        
        var chart = new Chart(chartPane.domNode, {
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
    function histogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, choice) {
        // console.log("graphBrowserInstance, scaleQuestion", graphBrowserInstance, scaleQuestion);
        
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

        var chartPane = newChartPane(graphBrowserInstance, style);
        
        var chartTitle = "" + nameForQuestion(scaleQuestion);
        // TODO: Maybe should translate choice?
        if (choiceQuestion) chartTitle = "" + choice;
        
        var chart = new Chart(chartPane.domNode, {
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
    
    function multipleHistograms(graphBrowserInstance, choiceQuestion, scaleQuestion) {
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
        
        // TODO: This may be wrong
        var noStyle = {};
        var chartPane = newChartPane(graphBrowserInstance, noStyle);
        
        var title = "" + nameForQuestion(scaleQuestion) + " vs. " + nameForQuestion(choiceQuestion) + " ...";
        // var content = new ContentPane({content: title, style: "text-align: center;"});
        var content = domConstruct.toDom('<span style="text-align: center;"><b>' + title + '</b></span><br>');
        
        chartPane.domNode.appendChild(content);
        
        for (index in options) {
            var option = options[index];
            histogramChart(graphBrowserInstance, scaleQuestion, choiceQuestion, option);
        }
        
        // End the float
        var clearFloat = domConstruct.create("br", {style: "clear: left;"});
        chartPane.domNode.appendChild(clearFloat);
    }
    
    function dojoScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion) {
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

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);
        
        var chart = new Chart(chartPane.domNode, {
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

    // Reference for initial scatter chart: http://bl.ocks.org/bunkat/2595950
    // Reference for brushing: http://bl.ocks.org/mbostock/4560481
    // Reference for brush and tooltip: http://wrobstory.github.io/2013/11/D3-brush-and-tooltip.html
    function d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion) {
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

        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chartTitle = "" + nameForQuestion(xAxisQuestion) + " vs. " + nameForQuestion(yAxisQuestion);
        
        // ----------- Diverges from Dojo Chart
        
        var fullWidth = 700;
        var fullHeight = 500;
        var margin = {top: 20, right: 15, bottom: 60, left: 60};
        var width = fullWidth - margin.left - margin.right;
        var height = fullHeight - margin.top - margin.bottom;
        
        var xScale = d3.scale.linear()
            .domain([0, d3.max(plotItems, function(plotItem) { return plotItem.x; })])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(plotItems, function(plotItem) { return plotItem.y; })])
            .range([height, 0]);       
        
        var chart = d3.select(chartPane.domNode)
            .append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart');
        
        var chartBody = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'scatterPlotMain');
        
        // draw the x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');

        chartBody.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('class', 'chart axis date')
            .call(xAxis);
        
        chartBody.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text(nameForQuestion(xAxisQuestion));
        
        // draw the y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');

        chartBody.append('g')
            .attr('transform', 'translate(0,0)')
            .attr('class', 'main axis date')
            .call(yAxis);
        
        chartBody.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(nameForQuestion(yAxisQuestion));
        
        // Append brush before data to ensure titles are drown
        var brush = chartBody.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush()
                .x(xScale)
                .y(yScale)
                .clamp([false, false])
                .on("brushend", brushend)
            );
        
        var nodes = chartBody.append("g")
                .attr("class", "node")
            .selectAll("circle")
                .data(plotItems)
            .enter().append("circle")
                .attr("r", 8)
                .attr("cx", function (plotItem) { return xScale(plotItem.x); } )
                .attr("cy", function (plotItem) { return yScale(plotItem.y); } );
        
        // Add tooltips
        nodes
            .append("svg:title")
            .text(function(plotItem) { return plotItem.story.__survey_storyName; });
        
        // Support starting a drag over a node
        nodes.on('mousedown', function(){
            var brushElements = chartBody.select(".brush").node();
            var newClickEvent = new Event('mousedown');
            newClickEvent.pageX = d3.event.pageX;
            newClickEvent.clientX = d3.event.clientX;
            newClickEvent.pageY = d3.event.pageY;
            newClickEvent.clientY = d3.event.clientY;
            brushElements.dispatchEvent(newClickEvent);
          });

        function brushend() {
            console.log("brushend", brush);
            var extent = d3.event.target.extent();
            var selectedStories = [];
            nodes.classed("selected", function(plotItem) {
              var selected = extent[0][0] <= plotItem.x && plotItem.x < extent[1][0] && extent[0][1] <= plotItem.y && plotItem.y < extent[1][1];
              if (selected) selectedStories.push(plotItem.story);
              return selected;
            });
            console.log("Selected stories", selectedStories);
        }
    }
    
    function contingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion) {
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
        
        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var table = new TableContainer({
            cols: columnCount + 2,
            showLabels: false,
            customClass: "contingencyTable",
            style: "width: 98%;",
            spacing: 10
        });
        
        var content;
        var row;
        var column;
        
        content = new ContentPane({content: "&lt;- <b>" + nameForQuestion(xAxisQuestion) + "</b> -&gt;", colspan: columnCount + 2, style: "text-align: center;"});
        table.addChild(content);
        
        content = new ContentPane({content: "V <b>" + nameForQuestion(yAxisQuestion) + "</b> V", colspan: 1});
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
            content = new ContentPane({content: "" + (results[JSON.stringify({y: rowLabelsArray[row]})] || 0), "colspan": 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "<i>[Column Total]</i>", colspan: 1});
        table.addChild(content);
        for (column = 0; column < columnCount; column++) {
            content = new ContentPane({content: "" + (results[JSON.stringify({x: columnLabelsArray[column]})] || 0), colspan: 1});
            table.addChild(content);
        }
        content = new ContentPane({content: "" + grandTotal, colspan: 1});
        table.addChild(content);
        
        chartPane.addChild(table);
    }
    
    function newChartPane(graphBrowserInstance, style) {
        var chartPane = new ContentPane({style: style});
        graphBrowserInstance.chartPanes.push(chartPane);
        graphBrowserInstance.graphResultsPane.addChild(chartPane);
        
        return chartPane;
    }
    
    function updateGraph(graphBrowserInstance) {
        console.log("updateGraph", graphBrowserInstance);
        
        var xAxisQuestionID = graphBrowserInstance.xAxisSelect.get("value");
        var yAxisQuestionID = graphBrowserInstance.yAxisSelect.get("value");
        
        // TODO: Translated or improve checking or provide alternate handling if only one selected
        if (!xAxisQuestionID && !yAxisQuestionID) return alert("Please select a question for one or both graph axes");
        
        // Remove old graph(s)
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
            } else {
                yType = "choice";
            }
        }
        
        console.log("types x y", xType, yType);
        
        if (xType === "choice" && yType === null) {
            console.log("plot choice: Bar graph");
            console.log("barGraph", xAxisQuestion);
            barChart(graphBrowserInstance, xAxisQuestion);
        } else if (xType === "choice" && yType === "choice") {
            console.log("plot choice: Contingency table");
            contingencyTable(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        } else if (xType === "choice" && yType === "scale") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
        } else if (xType === "scale" && yType === null) {
            console.log("plot choice: Histogram");
            histogramChart(graphBrowserInstance, xAxisQuestion);
        } else if (xType === "scale" && yType === "choice") {
            console.log("plot choice: Multiple histograms");
            multipleHistograms(graphBrowserInstance, yAxisQuestion, xAxisQuestion);
        } else if (xType === "scale" && yType === "scale") {
            console.log("plot choice: Scatter plot");
            d3ScatterPlot(graphBrowserInstance, xAxisQuestion, yAxisQuestion);
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
        
        var chartPane = newChartPane(graphBrowserInstance, singleChartStyle);
        
        var chart1Title = "" + xAxisQuestionID + " vs. " + yAxisQuestionID;
        
        var chart1 = new Chart(chartPane.domNode, {
            title: chart1Title
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
    
    function currentQuestionnaireChanged(graphBrowserInstance, currentQuestionnaire) {
        // Update selects for new question choices
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        graphBrowserInstance.questions = questions;
        
        var choices = widgetSupport.optionsForAllQuestions(questions, "excludeTextQuestions");
        widgetSupport.updateSelectChoices(graphBrowserInstance.xAxisSelect, choices);
        widgetSupport.updateSelectChoices(graphBrowserInstance.yAxisSelect, choices);
    }
    
    function loadLatestStoriesFromServerChanged(graphBrowserInstance, newEnvelopeCount, allStories) {
        console.log("loadLatestStoriesFromServerChanged", graphBrowserInstance, newEnvelopeCount, allStories);
        if (!newEnvelopeCount) return;
        
        // TODO: Update graphs if needed
    }
        
    function insertGraphBrowser(contentPane, model, fieldSpecification) {       
        var questions = surveyCollection.collectQuestionsForCurrentQuestionnaire();
        var choices = widgetSupport.optionsForAllQuestions(questions, "excludeTextQuestions");
        
        var xAxisSelect = widgetSupport.newSelect(contentPane, choices);
        xAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        // TODO: Translate
        var content = new ContentPane({content: " versus ", style: "display: inline;"});
        contentPane.addChild(content);
        
        var yAxisSelect = widgetSupport.newSelect(contentPane, choices);
        yAxisSelect.set("style", "width: 48%; max-width: 40%");
        
        var graphResultsPane = new ContentPane({
            // TODO: Translate
            title: "Graph results",
            style: chartEnclosureStyle
        });
        
        var graphBrowserInstance = {
            graphResultsPane: graphResultsPane,
            chartPanes: [], 
            xAxisSelect: xAxisSelect,
            yAxisSelect: yAxisSelect,
            questions: questions
        };
         
        var updateGraphButton = widgetSupport.newButton(contentPane, "#updateGraph|Update graph", lang.partial(updateGraph, graphBrowserInstance));
        
        contentPane.containerNode.appendChild(document.createElement("br"));
        contentPane.containerNode.appendChild(document.createElement("br"));
        
        contentPane.addChild(graphResultsPane);
        
        var loadLatestStoriesFromServerSubscription = topic.subscribe("loadLatestStoriesFromServer", lang.partial(loadLatestStoriesFromServerChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        contentPane.own(loadLatestStoriesFromServerSubscription);
        
        var currentQuestionnaireSubscription = topic.subscribe("currentQuestionnaire", lang.partial(currentQuestionnaireChanged, graphBrowserInstance));
        
        // TODO: Kludge to get this other previous created widget to destroy a subscription when the page is destroyed...
        contentPane.own(currentQuestionnaireSubscription);
        
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